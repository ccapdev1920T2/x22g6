const mongoose = require('mongoose');

var User = require('./user.js');

const Schema = mongoose.Schema;

const SUSPENSION_LENGTH = 30;

const suspendedUserSchema = new Schema({
    user: {
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

const SuspendedUser = mongoose.model('SuspendedUser', suspendedUserSchema, "suspendedUsers");

module.exports = SuspendedUser;