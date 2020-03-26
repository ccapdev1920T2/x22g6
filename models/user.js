const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STUDENT_TYPE = "Student";
const PROF_TYPE = "Professor";
const STAFF_TYPE = "Staff"

const userSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        min: 10000000,
        max: 99999999
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/,
        required : true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: [STUDENT_TYPE, PROF_TYPE, STAFF_TYPE],
        required: true
    },
    reputationPoints: {
        type: Number,
        required: function() {return this.type === STUDENT_TYPE},
        default: function() {if (this.type === STUDENT_TYPE) return 100}
    }
});