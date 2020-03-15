module.exports = function(app){
    app.get("/schedule", function(req, res){
        res.render("schedule");
    });

    app.get("/schedule/:date/:path", function(req, res){
        res.status(200);
        res.end();
    });
}