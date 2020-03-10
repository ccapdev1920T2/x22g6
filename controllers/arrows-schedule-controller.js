module.exports = function(app){
    app.get("/schedule", function(req, res){
        res.render("schedule");
    });
}