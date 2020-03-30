const User = require("../models/user");
const cookieName = "id";
const cookieOptions = {
    httpOnly: true,
    signed: true
};

// For sending the login page
exports.sendLoginPage = function(req, res){
    res.render("login");
}


// For logging-in the user.  
exports.logInUser = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email}, "_id password salt type");
        if(user && await user.isCorrectPassword(req.body.password)){
            res.cookie(cookieName, user._id, cookieOptions);
            res.setHeader("Location", user.getHomePageRoute());
            res.status(200).send();
        }else
            res.status(400).send("Invalid Login Credentials");
    }catch(err){
        res.status(500).send("Cannot Login at this time");
    }
}

// For logging-out the user
exports.logOutUser = function(req, res){
    res.clearCookie(cookieName, cookieOptions);
    res.redirect("/login");
}

// For sending the student registration page
exports.sendStudentRegistrationPage = function(req, res){
    res.render("register-student");
}

// For registering students
exports.registerStudent = function(req, res){
    /*
        User inputs are in req.body["first-name"], req.body["last-name"],
        req.body.email, req.body["id-number"], req.body.password
    */
    res.status(501).send("NOT IMPLEMENTED: Student Registration");
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