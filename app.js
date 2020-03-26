let express = require("express");
let hbs = require("hbs");
let mongoose = require("mongoose");

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

//Static files
app.use(express.static('./public'));

//Partial Registration
hbs.registerPartials(__dirname + "/views/partials");

// Controllers
require("./controllers/login-controller.js")(app);
require("./controllers/profile-controller.js")(app);
require("./controllers/registration-controller.js")(app);
require("./controllers/reservations-controller.js")(app);
require("./controllers/arrows-schedule-controller.js")(app);


app.listen(PORT, () => console.log("Listening at port " + PORT));