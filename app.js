let express = require("express");
let hbs = require("hbs");
let bodyParser = require("body-parser");

let app = express();
const PORT =  3000;

//Template engine
app.set("view engine", "hbs");

//Static files
app.use(express.static('./public'));
//Body parsing middleware
app.use(bodyParser.urlencoded({extended: false}));

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
app.use("/login", require("./routes/login-routes"));
app.use("/profile", require("./routes/profile-routes"));
app.use("/register", require("./routes/register-routes"));
app.use("/reservation", require("./routes/reservation-routes"));
app.use("/schedule", require("./routes/schedule-routes"));

app.listen(PORT, () => console.log("Listening at port " + PORT));