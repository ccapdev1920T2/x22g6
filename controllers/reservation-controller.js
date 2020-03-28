// For sending the my-reservations page
exports.sendMyReservationsPage = function(req, res){
    res.render("my-reservations");
}

// For sending user-reservations.hbs template
exports.sendUserReservationsPage = function(req, res){
    res.render("user-reservations");
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
exports.checkInUser = function(req, res){
    // Information is stored in req.body.trip, req.body.time, req.body.date, and req.body["id-number"]
    res.status(501).send("NOT IMPLEMENTED: Checking-in");
}