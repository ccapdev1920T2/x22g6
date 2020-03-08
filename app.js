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
require("./controllers/login.js")(app);
require("./controllers/profile.js")(app);
require("./controllers/registration.js")(app);
require("./controllers/reservations.js")(app);
require("./controllers/arrows-schedule.js")(app);


app.listen(PORT, () => console.log("Listening at port " + PORT));