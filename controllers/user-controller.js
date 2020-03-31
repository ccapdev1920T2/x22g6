const User = require("../models/user.js");

// For sending the login page
exports.sendLoginPage = function(req, res){
    res.render("login");
}


// For logging-in the user.  
exports.logInUser = function(req, res){
    
    //The email and password input can be accessed through req.body.email and req.body.password
    res.status(501).send("NOT IMPLEMENTED: Logging In");
}

// For sending the student registration page
exports.sendStudentRegistrationPage = function(req, res){
    res.render("register-student");
}

// For registering students
exports.registerStudent = async function(req, res){
    /*
        User inputs are in req.body["first-name"], req.body["last-name"],
        req.body.email, req.body["id-number"], req.body.password
    */
    try{
        await User.createUser(req.body["id-number"], req.body["first-name"], req.body["last-name"], req.body.email, req.body.password, User.STUDENT_TYPE);
        res.status(201).send();
    }
    catch(err){
        
        if(err.code === 11000){
            if(err.keyPattern._id === 1) res.status(400).send("ID Number already exists");
            
            else if (err.keyPattern.email === 1) res.status(400).send("Email Address already exists");
            
        }
        else res.status(500).send("Cannot register at this time");
    }
}

// For sending the professor registration page.
exports.sendProfessorRegistrationPage = function(req, res){
    res.render("register-professor");
}

// For registering professors
exports.registerProfessor = function(req, res){
    //req.body contains inputs {'first-name', 'last-name', email, 'id-number', password, 'confirm-password'}
    res.status(501).send("NOT IMPLEMENTED: Professor Registration");
}

// For sending the profile page
exports.sendProfilePage = function(req, res){
    res.render("profile");
}


// For editing the user profile.  
exports.editProfile = function(req, res){
    // The user inputs can be accessed through req.body["first-name"], req.body["last-name"], req.body.email
    res.status(501).send("NOT IMPLEMENTED: Editing profile");
}


// For changing user password.
exports.changeUserPassword = function(req, res){
    // The old password for confirmationis in req.body["old-password"] and new password is in req.body["new-password"]
    res.status(501).send("NOT IMPLEMENTED: Changing user password");
}