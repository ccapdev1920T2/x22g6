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