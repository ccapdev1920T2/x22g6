const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STUDENT_TYPE = "Student";
const PROF_TYPE = "Professor";
const STAFF_TYPE = "Staff"

const userSchema = new Schema({
    _id: {
        type: Number,
        required: true
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
        default: 100
    }
});