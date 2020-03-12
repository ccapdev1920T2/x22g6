const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    _id: {
        type: Number,
        required: true
    },

    name: [{
        first_name: {
            type: String,
            required: true
        },

        last_name: {
            type: String,
            required: true
        }
    }],

    email: {
        type: String,
        required : true
    },

    //Temporary until there is encryption
    password: {
        type: String,
        required: true
    },

    user_type: {
        type: String,
        default: Student
    },

    reputation_points: {
        type: Number,
        default: 100
    }
});