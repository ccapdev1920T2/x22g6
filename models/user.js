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
    type: {
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

/*
    Adds a new user to the db.  If successful, returns a promise that resolves to
    an instance of the userSchema's model corresponding to the newly
    inserted document; otherwise would throw an error
*/
userSchema.statics.createUser = function(idNumber, firstName, lastName, email, password, type){
    let user = new this({
        firstName, lastName, email, password, type,
        _id: idNumber
    });
    return user.save();
};




const User = mongoose.model("User", userSchema);
