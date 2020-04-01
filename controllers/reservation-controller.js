const Schedule = require("../models/schedule");
const Reservation = require("../models/reservation");

// For sending the my-reservations page
exports.sendMyReservationsPage = function(req, res){
    res.render("my-reservations", {user: req.user});
}

// For sending user-reservations.hbs template
exports.sendUserReservationsPage = function(req, res){
    res.render("user-reservations", {user: req.user});
}

// Gets user reservations for a specific date, trip, and time
exports.sendUserReservations = function(req, res){
    // req.params.time, req.params.date, req.params.trip
    res.status(501).send("NOT IMPLEMENTED: Getting user reservations")
}

// For creating reservations
exports.createReservation = function(req, res){
    // req.body would be an object containing {date, trip, time} of the reservation
    res.status(501).send("NOT IMPLEMENTED: Creating Reservations");
}


// For checking in user
exports.checkInUser = async function(req, res){
    try{
        let time = req.body.time;
        let schedule = await Schedule.findOne().byTrip(req.body.trip).where({time});
        
        let reservation = await Reservation.findOne({userId: req.body["id-number"], scheduleId: schedule._id}).byDate(req.body.date);
        if(reservation === null) res.status(404).send("User not found");
        else if(reservation.isCheckIn == true)   res.status(409).send("User already checked in");
            
        else{
            reservation.isCheckIn = true;
            reservation.save();
            res.status(202).send();
        }

    }
    catch(err){
        res.status(500).send("Check-in not available at this time");
    }
    
}