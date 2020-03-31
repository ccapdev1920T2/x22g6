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
            res.status(204).send();
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
exports.registerStudent = async function(req, res){
    try{
        await User.createUser(req.body["id-number"], req.body["first-name"], req.body["last-name"], req.body.email, req.body.password, User.STUDENT_TYPE);
        res.status(201).send();
    }
    catch(err){
        
        if(err.keyPattern._id === 1){
            User.find({email: req.body.email}, function(err, docs){
                if(err) res.status(500).send("Cannot register at this time");

                else if(docs.length) res.status(400).send("ID Number and Email Address already exists");

                else res.status(400).send("ID Number already exists");
            });
        }
        /**
         * This is done instead of a single else in case of changes within the order of schema/parameters which in turn
         * may change which err.keyPattern will be shown first as error
         */
        else if (err.keyPattern.email === 1){
            User.find({_id: req.body["id-number"]}, function(err, docs){
                if(err) res.status(500).send("Cannot register at this time");

                else if(docs.length) res.status(400).send("Email Address and ID Number already exists");

                else res.status(400).send("Email Address already exists");
            });
        }
        else res.status(500).send("Cannot register at this time");
    }
}

// For sending the professor registration page.
exports.sendProfessorRegistrationPage = function(req, res){
    res.render("register-professor", {user: req.user});
}

// For registering professors
exports.registerProfessor = function(req, res){
    //req.body contains inputs {'first-name', 'last-name', email, 'id-number', password, 'confirm-password'}
    res.status(501).send("NOT IMPLEMENTED: Professor Registration");
}

// For sending the profile page
exports.sendProfilePage = function(req, res){
    res.render("profile", {user: req.user});
}


// For editing the user profile.  
exports.editProfile = function(req, res){
    try{
        req.user.updateProfile(req.body["first-name"], req.body["last-name"], req.body.email);
        res.status(201).send();
    }
    catch(err){
        if(err.keyPattern.email === 1){
            res.status(400).send("Email Address already exists");
        }
        res.status(500).send("Cannot edit at this time");
    }
    
}


// For changing user password.
exports.changeUserPassword = function(req, res){
    // The old password for confirmationis in req.body["old-password"] and new password is in req.body["new-password"]
    res.status(501).send("NOT IMPLEMENTED: Changing user password");
}