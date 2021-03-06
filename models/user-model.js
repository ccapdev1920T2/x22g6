const mongoose = require('mongoose');
const crypto = require("crypto");
const util = require("util");

const Schema = mongoose.Schema;

const STUDENT_TYPE = "Student";
const STAFF_TYPE = "Staff"
const DEFAULT_REP_POINTS = 100;

// For password hashing
const ITERATIONS = 100000;
const DIGEST = "sha512";
const SALT_SIZE = 64;
const KEY_LEN = 128;
const ENCODING = "base64"

const userSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        min: 10000000,
        max: 99999999
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        match: /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/,
        required : true,
        unique : true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [STUDENT_TYPE, STAFF_TYPE],
        required: true
    },
    reputationPoints: {
        type: Number,
        required: function() {return this.type === STUDENT_TYPE},
        default: function() {if (this.type === STUDENT_TYPE) return DEFAULT_REP_POINTS}
    },
    isConfirmed: {
        type: Boolean,
        required: function() {return this.type === STUDENT_TYPE},
        default: function() {if (this.type === STUDENT_TYPE) return false}
    }
});

// For Password hasing.  returns a promise that resolves to the derived key as a Buffer
function hashPassword(password, salt){
    return util.promisify(crypto.pbkdf2)(password, salt, ITERATIONS, KEY_LEN, DIGEST);
}

/***************** User model static functions ******************/
/*
    Adds a new user to the db.  If successful, returns a promise that resolves to
    an instance of the User model corresponding to the newly
    inserted document; otherwise would reject the promise
*/
userSchema.statics.createUser = async function(idNumber, firstName, lastName, email, password, type){
    let salt = await util.promisify(crypto.randomBytes)(SALT_SIZE);
    let derivedKey = await hashPassword(password, salt);
    let user = new this({
        firstName, lastName, email, type,
        _id: idNumber,
        password: derivedKey.toString(ENCODING),
        salt: salt.toString(ENCODING)
    });
    return user.save();
};

userSchema.statics.STUDENT_TYPE = STUDENT_TYPE;
userSchema.statics.STAFF_TYPE = STAFF_TYPE;
userSchema.statics.DEFAULT_REP_POINTS = DEFAULT_REP_POINTS;

/***************** User model instance methods ******************/
/*
    Checks whether the specified password is the same as the instance of the
    User model.  Returns a promise that resolves to true if the password is the same
    and resolves to false otherwise.
*/
userSchema.methods.isCorrectPassword = async function(password){
    let derivedKey = await hashPassword(password, Buffer.from(this.salt, ENCODING));
    return derivedKey.toString(ENCODING) === this.password;
}
/*
    Changes the user's password.  Returns a promise that resolves to a Boolean value depending
    on whether the change was successful.  The change would only occur if the oldPassword argument
    is equal to the user's current password
*/
userSchema.methods.changePassword = async function(oldPassword, newPassword){
    let saltBuffer = Buffer.from(this.salt, ENCODING);
    let oldDerivedKey = await hashPassword(oldPassword, saltBuffer);
    if(oldDerivedKey.toString(ENCODING) === this.password){
        let newDerivedKey = await hashPassword(newPassword, saltBuffer);
        this.password = newDerivedKey.toString(ENCODING);
        await this.save();
        return true;
    }else
        return false;
}

// Returns a string of the user's homepage route depending on the user type
userSchema.methods.getHomePageRoute = function(){
    if(this.type === STUDENT_TYPE)
        return "/reservation/my-reservations";
    else if(this.type === STAFF_TYPE)
        return "/reservation/user-reservations";
}

const User = mongoose.model("User", userSchema);

module.exports = User;