const Schedule = require("../models/schedule-model");
const Reservation = require("../models/reservation-model");

// For sending the Arrow's Schedule Page
exports.sendArrowsSchedulePage = function(req, res){
    res.render("schedule", ({user: req.user}));
};

// For sending time slots for a specific trip of the form "<origin>-to-<dest>"
exports.sendTimeSlots = async function(req, res){
    // req.params.trip would contain the trip
    try{
        let schedules = await Schedule.find().byTrip(req.params.trip);
        let toSend = []
        for (var i = 0; i < schedules.length; i++) {
            toSend.push({
                'value': schedules[i].time,
                'presentation': schedules[i].get12HourFormat()
            });
        }
        res.status(200).send(toSend);
    }
    catch(err){
        res.status(500).send("NOT IMPLEMENTED: Getting time-slots for trip");
    }
   
}

// For sending reservations for each time-slot for a specific trip and date
exports.sendTimeSlotsWithReservations = async function(req, res){
    // req.params.date and req.params.trip would contain the date and trip of the request
    try{
        let schedules = await Schedule.find().byTrip(req.params.trip);
        let toSendRes = []
        for (var i = 0; i < schedules.length; i++) {
            toSendRes.push({
                'time': schedules[i].get12HourFormat(),
                'openSlots': 15 - (await Reservation.getReservationCount(req.params.date, schedules[i]))
            });
        }
        res.status(200).send(toSendRes);
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
    
}