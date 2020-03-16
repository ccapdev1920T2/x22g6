const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reservation = new Schema({
    id_number: {
        type: Number,
        required: true
    },

    destination: {
        type: Number,
        required: true
    },
    
    date: {
        type: Date,
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