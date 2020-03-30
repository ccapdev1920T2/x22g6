const User = require("../models/user");

// Checks if the user has not yet logged-in and redirects them to the login page if so
exports.redirectLogin = function(req, res, next){
    if(!req.signedCookies.id)
        res.redirect("/login");
    else 
        next();
}

// Checks if user has already logged-in and redirects them to their homepage if so
exports.redirectHome = async function(req, res, next){
    try{
        if(req.signedCookies.id)
            res.redirect((await User.findById(req.signedCookies.id)).getHomePageRoute());
        else
            next();
    }catch(err){
        res.redirect("/login");
    }
}

// Checks if user is a non-staff user to see if they authorized to access a resource
exports.checkNonStaff = async function(req, res, next){
    try{
        let user = await User.findById(req.signedCookies.id, "type");
        if(user.type === User.STUDENT_TYPE || user.type === User.PROF_TYPE)
            next();
        else
            res.status(403).send("You are not authorized to access this resource");
    }catch(err){
        res.redirect("/login");
    }
}

// Checks if user is a staff user to see if they authorized to access a resource
exports.checkStaff = async function(req, res, next){
    try{
        let user = await User.findById(req.signedCookies.id, "type");
        if(user.type === User.STAFF_TYPE)
            next();
        else
            res.status(403).send("You are not authorized to access this resource");
    }catch(err){
        res.redirect("/login");
    }
}
