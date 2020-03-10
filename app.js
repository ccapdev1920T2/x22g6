let express = require("express");
let hbs = require("hbs");

let app = express();
const PORT =  3000;

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