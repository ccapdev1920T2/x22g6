const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    origin: {
        type: String,
        enum: ['Laguna', 'Manila'],
        required: true
    },

    destination: {
        type: String,
        enum: ['Laguna', 'Manila'],
        required: true
    },

    time: {
        type: Number,
        required: true
    }
});

const Schedule = mongoose.model("Schedule", scheduelSchema);

module.exports = Schedule;