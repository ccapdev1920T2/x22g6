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

scheduleSchema.index({origin: 1, destination: 1, time: 1}, {unique: true});

/**************Schedule model instance methods *********************/
// Returns a string that represents the time of the schedule using the 12-hour clock
scheduleSchema.methods.get12HourFormat = function(){
    let hour = Math.floor(this.time / 100);
    let minute = this.time % 100;
    let suffix = (hour >= 12) ? "P.M." : "A.M.";
    hour = (hour > 12) ? hour - 12: hour;
    minute = (minute === 0) ? minute + "0" : minute;
    return hour + ":" + minute + " " + suffix;
}

/****************Schedule model static funcitons *******************************/
// Finds schedules whose properties matches the string "<origin>-to-<destination>"
scheduleSchema.statics.findByPath = function(path){
    let splitted = path.split("-to-");
    let origin = splitted[0];
    let destination = splitted[1];
    return this.find({origin, destination});
}

scheduleSchema.statics.LAG = LAG;
scheduleSchema.statics.MNL = MNL;

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;