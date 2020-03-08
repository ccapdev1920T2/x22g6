module.exports = function(app){
    app.get("/register-student", function(req, res){
        res.render("register-student");
    });

    app.get("/register-professor", function(req, res){
        res.render("register-professor");
    });
}