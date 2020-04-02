const mongoose = require('mongoose');

var User = require('./user.js');
var Schedule = require('./schedule.js');

const Schema = mongoose.Schema;

const MAX_RESERVATIONS = 2;
const MAX_RESERVATIONS_ERR = "MAX_RESERVATIONS";
const INVALID_TIME_SLOT_ERR = "INVALID_TIME_SLOT";

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

    isPremium: {
        type: Boolean,
        required: true
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

/*************** Middlewares ******************/
// Ensures that the number of reservations in a single day does not exceed the maximum
reservationSchema.pre("save", async function(next){
    let exisitingReservations = await mongoose.model("Reservation").find({userId: this.userId, date: this.date});
    if(exisitingReservations.length === MAX_RESERVATIONS){
        let err = new Error("Maximum number of reservations in a single day reached");
        err.reason = MAX_RESERVATIONS_ERR;
        throw err;
    }
});

// Ensures that the reservation date and time is valid
reservationSchema.pre("save", async function(){
    let schedule = await Schedule.findById(this.scheduleId);
    let reservationDate = new Date(this.date);
    reservationDate.setHours(schedule.time / 100);
    reservationDate.setMinutes(schedule.time % 100);
    if(reservationDate.getTime() - 900000 <= (new Date()).getTime()){
        let err = new Error("You can only reserve 15 minutes before the departure time");
        err.reason = INVALID_TIME_SLOT_ERR;
        throw err;
    }
    return;
})

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
reservationSchema.statics.createReservation = async function(idNumber, date, trip, time, isPremium){
    let reservation = new Reservation({userId: idNumber, isPremium});
    date = new Date(date + "T00:00:00");
    let schedule = await Schedule.findOne().byTrip(trip).where({time});
    reservation.scheduleId = schedule._id;
    reservation.date = date;
    return reservation.save();
}

reservationSchema.statics.MAX_RESERVATIONS_ERR = MAX_RESERVATIONS_ERR
reservationSchema.statics.INVALID_TIME_SLOT_ERR = INVALID_TIME_SLOT_ERR;

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;