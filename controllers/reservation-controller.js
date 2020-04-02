const Reservation = require("../models/reservation");
const Schedule = require("../models/schedule");
const SusependedUser = require("../models/suspended-user");

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
const WEEK_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

// Groups an array of reservation documents by month
function groupByMonth(resInput){
    let grouped = [];
    let i = 0;
    while(i < resInput.length){
        let currentMonth = resInput[i].date.getMonth();
        grouped.push({
            month: MONTH_NAMES[currentMonth],
            year: resInput[i].date.getFullYear(),
            dayReservations: [resInput[i]]
        });
        i++;
        while(i < resInput.length && resInput[i].date.getMonth() === currentMonth){
            grouped[grouped.length - 1].dayReservations.push(resInput[i]);
            i++;
        }
    }
    return grouped
}

// Groups an array of reservation documents by day
function groupByDay(resInput){
    let grouped = [];
    let i = 0;
    while(i < resInput.length){
        let currentDay = resInput[i].date.getDate();
        grouped.push({
            day: currentDay,
            week: WEEK_NAMES[resInput[i].date.getDay()],
            reservations: [resInput[i]]
        });
        i++;
        while(i <resInput.length && resInput[i].date.getDate() === currentDay){
            grouped[grouped.length - 1].reservations.push(resInput[i]);
            i++;
        }
    }
    return grouped;
}

// For sending the my-reservations page
exports.sendMyReservationsPage = async function(req, res){
    let today = new Date();
    let get12HourFormat = (value) => {value.scheduleId.time12Hour = value.scheduleId.get12HourFormat();};
    // Today's Reservations
    let reservationsToday = await Reservation.find({userId: req.signedCookies.id}).populate("scheduleId").byDateObject(today);
    reservationsToday.forEach(get12HourFormat);
    // Future Reservations
    let futureReservations = await Reservation.find({userId: req.signedCookies.id})
        .fromDateObject(today)
        .populate({path: "scheduleId", options: {sort: {"time": 1}}})
        .sort("date");
    futureReservations.forEach(get12HourFormat);
    futureReservations = groupByMonth(futureReservations);
    for(let i=0; i<futureReservations.length; ++i){
        futureReservations[i].dayReservations = groupByDay(futureReservations[i].dayReservations);
    }
    res.render("my-reservations", {user: req.user, reservationsToday, futureReservations});
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