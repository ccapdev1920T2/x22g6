if(process.env.NODE_ENV === "development") require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const db = require("./models/db");
const smtpMailer = require("./helpers/smtp-mailer");
const suspendedUserController = require("./controllers/suspended-user-controller");
const reservationController = require("./controllers/reservation-controller");

let app = express();
const PORT =  process.env.PORT || 3000;

//Database Connection
db.connect().catch((err) => console.log("Cannot connect to MongoDB server: " + err));
smtpMailer.transporter.verify().then(
    () => console.log("Verified SMTP connection configuration"),
    (err) => console.log("Cannot verify SMTP connection configuration: " + err)
); 

//Template engine
app.set("view engine", "hbs");
// HBS Helpers
hbs.registerHelper("getCurrentDate", function(){
    let today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let formatNumber = (value) => value >= 10 ? value : "0" + value;
    return today.getFullYear() + "-" + formatNumber(month) + "-" + formatNumber(day);
});

// For cron jobs and scheduling of lifting suspended users
suspendedUserController.scheduleReleaseDate();
reservationController.setUpCron();

//Static files
app.use(express.static('./public'));
//Body parsing middleware
app.use(bodyParser.urlencoded({extended: false}));
//Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Partial Registration
hbs.registerPartials(__dirname + "/views/partials");

// Routes
app.get("/", auth.redirectLogin, auth.redirectHome);
app.use("/login", require("./routes/login-routes"));
app.use("/profile", require("./routes/profile-routes"));
app.use("/register", require("./routes/register-routes"));
app.use("/reservation", require("./routes/reservation-routes"));
app.use("/schedule", require("./routes/schedule-routes"));
app.use("/confirmation", require("./routes/confirmation-routes"));
// For logging out
app.get("/logout", require("./controllers/user-controller").logOutUser);
app.get("/favicon.ico", function(req, res){
    res.sendStatus(204);
});
app.use(function(req, res){
    if(req.accepts("html"))
        res.render("message", {title:"404", message: "The page you are looking for does not exist"});
    else
        res.sendStatus(400);
});

let server = app.listen(PORT, () => console.log("Listening at port " + PORT));

const shutdown = function(){
    console.log("Shutting down server...");
    server.close(async function(err){
        try{
            if(err) throw err;
            console.log("Closed remaining connections");
            await db.connection.close();
            console.log("Server shut down");
            process.exit(0);
        }catch(err){
            console.log("Error during shut down: " + err);
            process.exit(1);
        }
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);