const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");

let app = express();
const PORT =  3000;

//Database Connection
const dbUrl = "mongodb://client:bTd5EVKM9Lba@test-shard-00-00-lcbdt.mongodb.net:27017,test-shard-00-01-lcbdt.mongodb.net:27017,test-shard-00-02-lcbdt.mongodb.net:27017/arrows-express?ssl=true&replicaSet=test-shard-0&authSource=admin&retryWrites=true&w=majority"; // Temporary connection to cloud database
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