module.exports = function(app){
    app.get("/my-reservations", function(req, res){
        res.render("my-reservations");
    });

    app.get("/user-reservations", function(req, res){
        res.render("user-reservations");
    });
    
    // For handling check ins from staff
    app.post("/check-in", function(req, res){
        res.status(200);
        res.end();
    });
}