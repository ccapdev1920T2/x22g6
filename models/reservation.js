const mongoose = require('mongoose');

var User = require('./user.js');
var Schedule = require('./schedule.js');

const Schema = mongoose.Schema;

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
        set: function(value) {return new Date(value.getFullYear(), value.getMonth(), value.getDate());}
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

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;