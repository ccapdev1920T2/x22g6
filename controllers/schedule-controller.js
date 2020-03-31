// For sending the Arrow's Schedule Page
exports.sendArrowsSchedulePage = function(req, res){
    res.render("schedule", ({user: req.user}));
};

// For sending time slots for a specific trip of the form "<origin>-to-<dest>"
exports.sendTimeSlots = function(req, res){
    // req.params.trip would contain the trip
    res.status(501).send("NOT IMPLEMENTED: Getting time-slots for trip");
}

// For sending reservations for each time-slot for a specific trip and date
exports.sendTimeSlotsWithReservations = function(req, res){
    // req.params.date and req.params.trip would contain the date and trip of the request
    res.status(501).send("NOT IMPLEMENTED: Getting reserivation for each time slot");
}