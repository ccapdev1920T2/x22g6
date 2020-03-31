// For sending the my-reservations page
exports.sendMyReservationsPage = function(req, res){
    console.log(req.user);
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
exports.checkInUser = function(req, res){
    // Information is stored in req.body.trip, req.body.time, req.body.date, and req.body["id-number"]
    res.status(501).send("NOT IMPLEMENTED: Checking-in");
}