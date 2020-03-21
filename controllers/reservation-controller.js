// For sending the my-reservations page
exports.sendMyReservationsPage = function(req, res){
    res.render("my-reservations");
}

// For sending user-reservations.hbs template
exports.sendUserReservationsPage = function(req, res){
    res.render("user-reservations");
}