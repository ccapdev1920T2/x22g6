module.exports = function(app){
    app.get("/my-reservations", function(req, res){
        res.render("my-reservations");
    });

    app.get("/user-reservations", function(req, res){
        res.render("user-reservations");
    });
}