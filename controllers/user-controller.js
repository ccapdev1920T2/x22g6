const User = require("../models/user-model");
const smtpMailer = require("../helpers/smtp-mailer");
const jwt = require("jsonwebtoken");
const cookieName = "id";
const cookieOptions = {
    httpOnly: true,
    signed: true
};
const hbs = require("hbs");

// Helper registration
hbs.registerHelper("isStaff", function(type){
    return type === User.STAFF_TYPE;
});

// For sending email confirmation link
async function sendEmailConfirmation(id, email, host, firstName, protocol){
    email = email.toLowerCase();
    let webToken = jwt.sign({id, email}, process.env.JWT_SECRET);
    return smtpMailer.transporter.sendMail({
        from: `no-reply@${host}`,
        to: email,
        subject: "Email Confirmation",
        html:`Hello ${firstName},<br>
            Thank you for registering to Re:Arrows.  To utilizie your account, you must verify your email through clicking the
            following <a href="${protocol}://${host}/confirmation/${webToken}">link</a>`
    });
}

// For sending the login page
exports.sendLoginPage = function(req, res){
    res.render("login");
}


// For logging-in the user.  
exports.logInUser = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(user && await user.isCorrectPassword(req.body.password)){
            if(user.type === User.STAFF_TYPE || user.isConfirmed){
                res.cookie(cookieName, user._id, cookieOptions);
                res.setHeader("Location", user.getHomePageRoute());
                res.status(204).send();
            }else
                res.status(400).send("You must first confirm your email to login");
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
        await User.createUser(
            req.body["id-number"], 
            req.body["first-name"], 
            req.body["last-name"], 
            req.body.email, 
            req.body.password, 
            User.STUDENT_TYPE);
            
        await sendEmailConfirmation(req.body["id-number"], req.body.email, req.get("host"), req.body["first-name"], req.protocol);
            
        res.status(201).send();
    }
    catch(err){
        if(err.keyPattern && err.keyPattern._id === 1){
            User.find({email: req.body.email}, function(err, docs){
                if(err) res.status(500).send("Cannot register at this time");

                else if(docs.length) res.status(400).send("ID Number and Email Address already exists");

                else res.status(400).send("ID Number already exists");
            });
        }
        else if (err.keyPattern && err.keyPattern.email === 1){
            User.find({_id: req.body["id-number"]}, function(err, docs){
                if(err) res.status(500).send("Cannot register at this time");

                else if(docs.length) res.status(400).send("Email Address and ID Number already exists");

                else res.status(400).send("Email Address already exists");
            });
        }
        else res.status(500).send("Cannot register at this time");
    }
}

// For sending the profile page
exports.sendProfilePage = function(req, res){
    res.render("profile", {user: req.user});
}


// For editing the user profile.  
exports.editProfile = async function(req, res){
    try{
        req.user.firstName = req.body["first-name"];
        req.user.lastName = req.body["last-name"];
        await req.user.save();
        res.status(204).send();
    }
    catch(err){        
        res.status(500).send("Cannot edit at this time");
    }
}


// For changing user password.
exports.changeUserPassword = async function(req, res){
    // The old password for confirmation is in req.body["old-password"] and new password is in req.body["new-password"]
    try{
        if(await req.user.changePassword(req.body["old-password"], req.body["new-password"])) res.status(204).send();

        else res.status(400).send("Old password is incorrect");
    }
    catch(err){
        res.status(500).send("Cannot change password at this time");
    }
}

// For email confirmation
exports.confirmEmail = async function(req, res){
    let viewFile = "message"
    try{
        let payload = jwt.verify(req.params.token, process.env.JWT_SECRET);
        let updateOperation = await User.updateOne({_id: payload.id, email: payload.email}, {"$set" : {isConfirmed: true}});
        let loginLink = "Click <a href=\"/login\">here</a> to login"
        if(updateOperation.n && updateOperation.nModified)
            res.render(viewFile, {title: "Success", message: "Your email has been confirmed. " + loginLink});
        else if(updateOperation.n)
            res.render(viewFile, {title: "Success", message: "You have already confirmed your email.  " + loginLink});
        else
            res.render(viewFile, {title: "Error", message: "The account does not exist"});
    }catch(err){
        if(err.name === "JsonWebTokenError")
            res.render(viewFile, {title: "Error", message: "Invalid email confirmation link"});
        else
            res.render(viewFile, {title: "Error", message: "Cannot confirm email at this time"});
    }
}