const mongoose = require('mongoose');

var User = require('./user-model.js');

const Schema = mongoose.Schema;

const SUSPENSION_LENGTH = 30;

const suspendedUserSchema = new Schema({
    userId: {
        type: Schema.Types.Number,
        ref: 'User',
        required: true,
        validate: async function(value) {return await User.findById(value)}
    },

    releaseDate: {
        type: Date,
        required: true,
        default: function(){
            let today = new Date();
            today.setDate(today.getDate() + SUSPENSION_LENGTH);
            return today;
        }
    }
});

/**************Suspended User Instance methods **************************** */
// Returns the release date as a string in YYYY-MM-DD form
suspendedUserSchema.methods.getReleaseDateFormatted = function(){
    return `${this.releaseDate.getFullYear()}-${this.releaseDate.getMonth() + 1}-${this.releaseDate.getDate()}`;
}

// Returns the time of the release date
suspendedUserSchema.methods.getReleaseDateTime = function(){
    let hours = this.releaseDate.getHours();
    let minutes = this.releaseDate.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let suffix;
    if(hours >= 13){
        hours -= 12;
        suffix = "P.M.";
    }else{
        suffix = "A.M.";
        hours = hours === 0 ? 12 : hours;
    }
    return `${hours}:${minutes} ${suffix}`;

}

// Lifts the suspension of the user and reverts their points back to the default number of points
suspendedUserSchema.methods.liftSuspension = async function(){
    await User.updateOne({_id: this.userId}, {"$set" : {reputationPoints: User.DEFAULT_REP_POINTS}});
    return await this.remove();
}

const SuspendedUser = mongoose.model('SuspendedUser', suspendedUserSchema, "suspendedUsers");

module.exports = SuspendedUser;