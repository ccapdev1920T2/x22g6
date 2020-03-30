const mongoose = require('mongoose');

var User = require('./user.js');
var Schedule = require('./schedule.js');

const Schema = mongoose.Schema;

const MAX_RESERVATIONS = 2;

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

/*************** Middlewares ******************/
// Ensures that the number of reservations in a single day does not exceed the maximum
reservationSchema.pre("save", async function(){
    let exisitingReservations = await mongoose.model("Reservation").find({userId: this.userId, date: this.date});
    if(exisitingReservations.length === MAX_RESERVATIONS)
        throw new Error("Maximum number of reservations in a single day reached");
});

function disregardTime(date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/***************Reservation model static functions ***********************/
/*
    Adds a new reservation to the db.  The trip argument must be of the form "<origin>-to-<destination>".
    The time argument must be in military time.  Returns a promise that resolves to a Reservation model 
    instance if successfully added to the db
*/
reservationSchema.statics.createReservation = async function(idNumber, date, trip, time, isPremium){
    let reservation = new Reservation({userId: idNumber, date, isPremium});
    let schedule = await Schedule.findOne().byTrip(trip).where({time});
    reservation.scheduleId = schedule._id;
    return reservation.save();
}

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;