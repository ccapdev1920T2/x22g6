const mongoose = require('mongoose');

var User = require('./user.js');
var Schedule = require('./schedule.js');

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    date: {
        type: Date,
        required: true
    },

    schedule: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
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