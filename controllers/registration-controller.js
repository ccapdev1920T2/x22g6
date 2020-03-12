module.exports = function(app){
    app.get("/register-student", function(req, res){
        res.render("register-student");
    });

    // For handing student registration
    app.post("/register-student", function(req, res){
        res.status(200);
        res.end();
    });

    app.get("/register-professor", function(req, res){
        res.render("register-professor");
    });

    app.post("/register-professor", function(req, res){
    	res.render("register-professor");
    });
}