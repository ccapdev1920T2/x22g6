let express = require("express");
let hbs = require("hbs");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let cookieParser = require("cookie-parser");
let auth = require("./middlewares/auth");

let app = express();
const PORT =  3000;

//Database Connection
const dbUrl = "mongodb://localhost:27017/arrowsTest" // Temporary local database 
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}
mongoose.connect(dbUrl, dbOptions);
mongoose.connection.on("connected", () => console.log("Mongoose connected to " + dbUrl));
mongoose.connection.on("error", () => console.log("Mongoose cannot connect to " + dbUrl));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected from " + dbUrl));

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
app.use(cookieParser("secret")); //TODO: change cookie secret

// TO DELETE.  For simulating slow responses
app.post("*", function(req, res, next){
    setTimeout(() => next(), 3000);
});
// TO DELETE.  For simulating slow responses
app.delete("*", function(req, res, next){
    setTimeout(() => next(), 3000);
});

//Partial Registration
hbs.registerPartials(__dirname + "/views/partials");

// Routes
app.get("/", auth.redirectLogin, auth.redirectHome);
app.use("/login", require("./routes/login-routes"));
app.use("/profile", require("./routes/profile-routes"));
app.use("/register", require("./routes/register-routes"));
app.use("/reservation", require("./routes/reservation-routes"));
app.use("/schedule", require("./routes/schedule-routes"));
// For logging out
app.get("/logout", require("./controllers/user-controller").logOutUser);

app.listen(PORT, () => console.log("Listening at port " + PORT));