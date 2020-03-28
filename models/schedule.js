const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LAG = "LAG";
const MNL = "MNL";

const scheduleSchema = new Schema({
    origin: {
        type: String,
        enum: [LAG, MNL],
        required: true
    },

    destination: {
        type: String,
        enum: [LAG, MNL],
        required: true
    },

    time: {
        type: Number,
        required: true
    }
});

const Schedule = mongoose.model("Schedule", scheduelSchema);

module.exports = Schedule;