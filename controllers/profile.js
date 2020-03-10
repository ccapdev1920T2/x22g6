module.exports = function(app){
    app.get("/profile", function(req, res){
        res.render("profile");
    });

    app.post("/profile", function(req, res){
    	res.render("profile");
    });
}