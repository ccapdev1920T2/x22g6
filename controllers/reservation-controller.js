const Schedule = require("../models/schedule-model");
const Reservation = require("../models/reservation-model");
const SuspendedUser = require("../models/suspended-user-model");
const User = require("../models/user-model");
const CronJob = require('cron').CronJob;

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
const WEEK_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
const LAG = "LAG";
const MNL = "MNL";

// Groups an array of reservation documents by month
function groupByMonth(resInput){
    let grouped = [];
    let i = 0;
    while(i < resInput.length){
        let currentMonth = resInput[i].date.getMonth();
        grouped.push({
            month: MONTH_NAMES[currentMonth],
            monthNum: currentMonth,
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

// Adds a time12Hour property to the reservation's scheduleId
function get12HourFormat(reservation){
    reservation.scheduleId.time12Hour = reservation.scheduleId.get12HourFormat();
};


/**
 * Checks each document in the Reservation Collection if they are not checked-in on the specific time and date
 * If not checked in, user will be deducted 10 reputation points
 */

async function checkReservations(time, origin){
    try{
        let date = new Date();
        let schedule = await Schedule.findOne({origin: origin, time: time});
        let reservations = await Reservation.find({scheduleId: schedule, isCheckIn: false}).byDateObject(date);
        for (let i = 0; i < reservations.length; i++){
            let user = await User.findOne({_id: reservations[i].userId});
            let points = user.reputationPoints;

            user.reputationPoints = points - 10;

            await user.save();
        }
    }
    catch(err){
        console.log(err);
    }
};

/*
    Converts the date and time arguments to a Date object.  The date arugment must be a string
    representing the date and the time argument must be in military time
*/
function convertToDateObject(date, time){
    date = new Date(date);
    date.setHours(time / 100);
    date.setMinutes(time % 100);
    return date;
}

// For sending the my-reservations page
exports.sendMyReservationsPage = async function(req, res){
    try{
        let today = new Date();
        let sortingCallback = (a, b) => a.scheduleId.time - b.scheduleId.time;
        // Today's Reservations
        let reservationsToday = await Reservation.find({userId: req.signedCookies.id}).populate("scheduleId").byDateObject(today);
        reservationsToday.forEach(get12HourFormat);
        reservationsToday.sort(sortingCallback);
        // Future Reservations
        let futureReservations = await Reservation.find({userId: req.signedCookies.id})
            .fromDateObject(today)
            .populate("scheduleId")
            .sort("date");
        futureReservations.forEach(get12HourFormat);
        futureReservations = groupByMonth(futureReservations);
        for(let i=0; i<futureReservations.length; ++i){
            futureReservations[i].dayReservations = groupByDay(futureReservations[i].dayReservations);
            futureReservations[i].dayReservations.forEach((dayReservation) => dayReservation.reservations.sort(sortingCallback));
        }
        res.render("my-reservations", {user: req.user, reservationsToday, futureReservations});
    }catch(err){
        res.sendStatus(500)
    }
}

// For sending user-reservations.hbs template
exports.sendUserReservationsPage = function(req, res){
    res.render("user-reservations", {user: req.user});
}

// Gets user reservations for a specific date, trip, and time
exports.sendUserReservations = async  function(req, res){
    // req.params.time, req.params.date, req.params.trip
    try{
        let schedule = await Schedule.findOne({time: req.params.time}).byTrip(req.params.trip);
        let reservations = await Reservation.find({scheduleId: schedule._id}).byDate(req.params.date).populate("userId");
        let toSend = [];
        for(let i=0; i<reservations.length; ++i){
            toSend.push({
                lastName: reservations[i].userId.lastName,
                firstName: reservations[i].userId.firstName,
                type: reservations[i].userId.type,
                idNumber: reservations[i].userId._id
            });
        }
        res.status(200).send(toSend);
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
}

// For creating reservations
exports.createReservation = async function(req, res){
    // req.body would be an object containing {date, trip, time} of the reservation
    try{
        let suspended = await SuspendedUser.findOne({userId: req.signedCookies.id});
        // Checks if the suspension is already lifted and removes it if it already is
        if(suspended && suspended.releaseDate.getTime() <= (new Date()).getTime()){
            await suspended.remove()
            suspended = null;
        }
        if(!suspended){ //For users that are not suspended
            let reservation = await Reservation.createReservation(
                req.signedCookies.id, 
                req.body.date,
                req.body.trip,
                req.body.time
            );
            await Reservation.populate(reservation, {path: "scheduleId"});
            get12HourFormat(reservation);
            if(req.get("Time-Slot-HTML")){
                let inputObject= groupByMonth([reservation])[0];
                inputObject.dayReservations = groupByDay(inputObject.dayReservations);
                res.status(200).render("partials/month-time-slots", inputObject);
            }else
                res.status(201).send();
        }else // For suspended users
            res.status(400).send("You're account is currently suspended until " + suspended.getReleaseDateFormatted() + " at " + suspended.getReleaseDateTime());
    }catch(err){
        if(err.code === 11000){
            if(err.keyPattern.userId === 1 && err.keyPattern.date === 1 && err.keyPattern.scheduleId === 1)
                res.status(400).send("You already have a reservation during the specified time");
        }else if(err.reason === Reservation.PRE_SAVE_ERR){
            res.status(400).send(err.message);
        }
        if(!res.headersSent)
            res.status(500).send("Cannot make reservation at this time");
    }
}


// For checking in user
exports.checkInUser = async function(req, res){
    try{
        let currentDate = new Date();
        let reservationDate = convertToDateObject(req.body.date, req.body.time);
        if(currentDate.getTime() >= reservationDate.getTime() - 300000){
            res.status(400).send("Time slot has already passed");
            return;
        }
        let schedule = await Schedule.findOne().byTrip(req.body.trip).where({time: req.body.time});
        let reservationUpdate = await Reservation.findOne({userId: req.body["id-number"], scheduleId: schedule._id})
            .byDate(req.body.date)
            .updateOne({}, {"$set": {isCheckIn: true}});
        if(!reservationUpdate.n) 
            res.status(404).send("Reservation not found");
        else if(reservationUpdate.n && reservationUpdate.nModified === 0)   
            res.status(409).send("User already checked in");
        else
            res.status(202).send();
    }
    catch(err){
        res.status(500).send("Check-in not available at this time");
    }
    
}

// For deleting reservations
exports.deleteReservation = async function(req, res){
    try{
        let dateWithTime = convertToDateObject(req.body.date, req.body.time);
        let today = new Date();
        if(dateWithTime.getTime() - Reservation.OFFSET_DEPARTURE <= today.getTime()){
            res.status(400).send("Cannot delete within 15 minutes before the departure time");
            return;
        }
        let date = new Date(req.body.date);
        let schedule = await Schedule.findOne().byTrip(req.body.trip).where({time: req.body.time});
        let deleteOperation = await Reservation.deleteOne({userId: req.signedCookies.id, scheduleId: schedule._id, date});
        if(deleteOperation.deletedCount === 0)
            res.status(400).send("The reservation does not exist");
        else
            res.status(202).send();
    }
    catch(err){
        res.status(500).send("Cannot delete Reservation at this time");
    }
}

//Cron Jobs for automatic tasks
async function setupCron(){
    try{
        let schedule = await Schedule.find();
        for(let i = 0; i < schedule.length; i++){
            let time = schedule[i].time;
            let hour = Math.floor(time / 100);
            let min = time % 100;
            if(min < 5){
                min += 60 - 5;
                hour -= 1;
            }
            else    min -= 5;
            
            let origin = schedule[i].origin;

            new CronJob(min + ' ' + hour + ' * * 1-5', async function(){
                await checkReservations(time, origin);
                console.log("Executing cron job for schedule " + time + ", " + origin);
            }, null, true, 'Asia/Manila');
        }
        console.log("Added cron jobs");
    }
    catch(err){
        console.log(err);
    }
}

setupCron();