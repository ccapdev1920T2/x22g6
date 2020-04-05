const mongoose = require('mongoose');

var User = require('./user-model.js');
var Schedule = require('./schedule-model.js');

const Schema = mongoose.Schema;

const MAX_RESERVATIONS = 2;
const PRE_SAVE_ERR = "PRE_SAVE_ERR";
const OFFSET_DEPARTURE = 1000 * 60 * 15; // 15 minutes
const MAX_PASSENGERS = 15;

const reservationSchema = new Schema({
    userId: {
        type: Schema.Types.Number,
        ref: 'User',
        required: true,
        // Ensures that the id being referenced exists
        validate: async function(value) {return await User.findById(value)}
    },
    
    date: {
        type: Date,
        required: true,
        // For disregarding the time component of the date
        set: disregardTime
    },

    scheduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true,
        // Ensures that the id being referenced exists
        validate: async function(value){return await Schedule.findById(value)}
    },

    isCheckIn: {
        type: Boolean,
        required: true,
        default: false
    }
});

reservationSchema.index({userId: 1, date: 1, scheduleId: 1}, {unique: true});


/**************Query Helpers********************** */
/*
    Query's all date with the given string.  The string must be
    of the form "YYYY-MM-DD"
*/
reservationSchema.query.byDate = function(date){
    return this.where({date: new Date(date + "T00:00:00")});
}
/*
    Query's all reservations that matches the given date object.  The time
    of the argument would be disregarded
*/
reservationSchema.query.byDateObject = function(date){
    date = disregardTime(date);
    return this.where({date});
}
/*
    Query's all reservations whose date is newer than the specified date object.
    The time of the argument would be disregarded
*/
reservationSchema.query.fromDateObject = function(date){
    date = disregardTime(date);
    return this.where({date: {"$gt" : date}});
}

/*************** Middlewares ******************/
// Ensures that the number of reservations in a single day does not exceed the maximum
reservationSchema.pre("save", async function(){
    let exisitingReservations = await mongoose.model("Reservation").find({userId: this.userId, date: this.date});
    if(exisitingReservations.length === MAX_RESERVATIONS){
        let err = new Error("Maximum number of reservations in a single day reached");
        err.reason = PRE_SAVE_ERR;
        throw err;
    }
});

reservationSchema.pre("save", async function(){
    let reservations = await mongoose.model("Reservation").find({scheduleId: this.scheduleId}).byDateObject(this.date);
    if(reservations.length >= MAX_PASSENGERS){
        let err = new Error("There are no more open slots for the chosen reservation");
        err.reason = PRE_SAVE_ERR;
        throw err;
    }
})

// For all middlewares that utilizes the schedule properties of the reservation
reservationSchema.pre("save", async function(){
    let schedule = await Schedule.findById(this.scheduleId);
    await checkOffset(this, schedule);
    await checkForOriginAndTime(this, schedule);
});

// Ensures that the reservation is before the departure time with the given offset
async function checkOffset(reservation, schedule){
    let reservationDate = new Date(reservation.date);
    reservationDate.setHours(schedule.time / 100);
    reservationDate.setMinutes(schedule.time % 100);
    if(reservationDate.getTime() - OFFSET_DEPARTURE <= (new Date()).getTime()){
        let err = new Error("You can only reserve 15 minutes before the departure time");
        err.reason = PRE_SAVE_ERR;
        throw err;
    }
}

// Ensures each reservation in a single day does not have the same origin or time
async function checkForOriginAndTime(reservation, schedule){
    let forChecking = await mongoose.model("Reservation")
        .findOne({userId: reservation.userId, date: reservation.date})
        .populate("scheduleId");
    if(forChecking){
        if(forChecking.scheduleId.origin === schedule.origin){
            let err = new Error("You already have a reservation coming from " + schedule.origin + " for the date specified");
            err.reason = PRE_SAVE_ERR;
            throw err;
        }
        if(forChecking.scheduleId.time === schedule.time){
            let err = new Error("You already have a reservation at " + schedule.get12HourFormat() + " for the date specified");
            err.reason = PRE_SAVE_ERR;
            throw err;
        }
    }
}

function disregardTime(date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/***************Reservation model static functions ***********************/
/*
    Adds a new reservation to the db.  The trip argument must be of the form "<origin>-to-<destination>".
    The time argument must be in military time.  The date must be of the form YYYY-MM-DD.
    Returns a promise that resolves to a Reservation model 
    instance if successfully added to the db
*/
reservationSchema.statics.createReservation = async function(idNumber, date, trip, time){
    let reservation = new Reservation({userId: idNumber});
    date = new Date(date + "T00:00:00");
    let schedule = await Schedule.findOne().byTrip(trip).where({time});
    reservation.scheduleId = schedule._id;
    reservation.date = date;
    return reservation.save();
}

/*
    Gets the number of reservations for a given date and schedule.  The date
    must be a string in the form "YYYY-MM-DD" and the schedule should be a Schedule document
*/
reservationSchema.statics.getReservationCount = async function(date, schedule){
    let reservations = await this.find({scheduleId: schedule._id}).byDate(date);
    return reservations.length;
}

reservationSchema.statics.PRE_SAVE_ERR = PRE_SAVE_ERR;
reservationSchema.statics.MAX_PASSENGERS = MAX_PASSENGERS;

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;