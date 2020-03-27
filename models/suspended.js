const mongoose = require('mongoose');

var User = require('./user.js');

const Schema = mongoose.Schema;

const suspendedSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    release_date: {
        type: Date,
        required: true
    }
});

const Suspended = mongoose.model('Suspended', suspendedSchema);

module.exports = Suspended;