const mongoose = require('mongoose');
const crypto = require("crypto");
const util = require("util");

const Schema = mongoose.Schema;

const STUDENT_TYPE = "Student";
const PROF_TYPE = "Professor";
const STAFF_TYPE = "Staff"

// For password hasing
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
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/,
        required : true,
        unique : true
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
        enum: [STUDENT_TYPE, PROF_TYPE, STAFF_TYPE],
        required: true
    },
    reputationPoints: {
        type: Number,
        required: function() {return this.type === STUDENT_TYPE},
        default: function() {if (this.type === STUDENT_TYPE) return 100}
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

//Checks if input is empty
function isEmpty(input){
    if (input == "") return true;
    return false;
}

//Changes user's profile. Does not return any but will change the value properties
userSchema.methods.updateProfile = async function(firstName, lastName, email){
    if (!isEmpty(firstName)) this.firstName = firstName;
    if (!isEmpty(lastName)) this.lastName = lastName;
    if (!isEmpty(email)) this.email = email;

    await this.save();
}

const User = mongoose.model("User", userSchema);

module.exports = User;