const Reservation = require("../models/reservation");
const SusependedUser = require("../models/suspended-user");

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
exports.createReservation = async function(req, res){
    // req.body would be an object containing {date, trip, time} of the reservation
    try{
        let suspended = await SusependedUser.findOne({userId: req.signedCookies.id});
        // Checks if the suspension is already lifted and removes it if it already is
        if(suspended && suspended.releaseDate.getTime() <= (new Date()).getTime()){
            await suspended.remove()
            suspended = null;
        }
        if(!suspended){ //For users that are not suspended
            await Reservation.createReservation(
                req.signedCookies.id, 
                req.body.date,
                req.body.trip,
                req.body.time,
                false
            );
            res.status(201).send();
        }else // For suspended users
            res.status(400).send("You're account is currently suspended until " + suspended.getReleaseDateFormatted() + " at " + suspended.getReleaseDateTime());
    }catch(err){
        if(err.code === 11000){
            if(err.keyPattern.userId === 1 && err.keyPattern.date === 1 && err.keyPattern.scheduleId === 1)
                res.status(400).send("You already have a reservation during the specified time");
        }else if(err.reason === Reservation.MAX_RESERVATIONS_ERR || err.reason === Reservation.INVALID_TIME_SLOT_ERR){
            res.status(400).send(err.message);
        }
        if(!res.headersSent)
            res.status(500).send("Cannot make reservation at this time");
    }
}


// For checking in user
exports.checkInUser = function(req, res){
    // Information is stored in req.body.trip, req.body.time, req.body.date, and req.body["id-number"]
    res.status(501).send("NOT IMPLEMENTED: Checking-in");
}