if(process.env.NODE_ENV === "development") require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const db = require("./models/db");

let app = express();
const PORT =  process.env.PORT || 3000;

//Database Connection
db.connect().then(value => console.log("Connected to database"), reason => console.log(reason));

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

app.listen(PORT, () => console.log("Listening at port " + PORT));