const mongoose = require('mongoose');

var User = require('./user.js');
var Schedule = require('./schedule.js');

var userSchema = mongoose.model('User').schema;
var scheduleSchema = mongoose.model('Schedule').schema;

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: [userSchema],
        required: true
    },
    
    date: {
        type: Date,
        required: true
    },

    schedule: {
        type: [scheduleSchema],
        required: true
    },

    is_premium: {
        type: Boolean,
        default: false
    },

    is_checkin: {
        type: Boolean,
        default: false
    }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;