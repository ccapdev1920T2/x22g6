// For sending the login page
exports.sendLoginPage = function(req, res){
    res.render("login");
}

// For sending the student registration page
exports.sendStudentRegistrationPage = function(req, res){
    res.render("register-student");
}

// For sending the professor registration page
exports.sendProfessorRegistrationPage = function(req, res){
    res.render("register-professor");
}

// For sending the profile page
exports.sendProfilePage = function(req, res){
    res.render("profile");
}