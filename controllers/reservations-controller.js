// Temporary storage for time slots
const LAG_TO_MNL_TIME_SLOTS = [
    {value: "0545", presentation: "5:45 AM"},
    {value: "0700", presentation: "7:00 AM"},
    {value: "0730", presentation: "7:30 AM"},
    {value: "0900", presentation: "9:00 AM"},
    {value: "1100", presentation: "11:00 AM"},
    {value: "1300", presentation: "1:00 PM"},
]

// Temporary storage for time slots
const MNL_TO_LAG_TIME_SLOTS = [
    {value: "0600", presentation: "6:00 AM"},
    {value: "0730", presentation: "7:30 AM"},
    {value: "0930", presentation: "9:30 AM"},
    {value: "1100", presentation: "11:00 AM"},
    {value: "1300", presentation: "1:00 PM"},
    {value: "1430", presentation: "2:30 PM"},
]

module.exports = function(app){
    app.get("/my-reservations", function(req, res){
        res.render("my-reservations");
    });

    app.get("/user-reservations", function(req, res){
        res.render("user-reservations");
    });

    //For handling request to make a reservation
    app.post("/reserve", function(req, res){
        res.status(200);
        res.end();
    });

    //For handling change in reservation time
    app.get("/location/:location", function(req, res){
        switch(req.params.location){
            case "MNL-to-LAG":
                res.send(MNL_TO_LAG_TIME_SLOTS);
                break;
            case "LAG-to-MNL":
                res.send(LAG_TO_MNL_TIME_SLOTS);
                break;
            default:
                res.status(400);
                res.end();
        }
    });
    
    // For handling check ins from staff
    app.post("/check-in", function(req, res){
        res.status(200);
        res.end();
    });
}