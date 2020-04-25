const SuspendedUser = require("../models/suspended-user-model");

exports.ScheduledDeletion = async function(req, res){
    try{
         let suspended = await SuspendedUser.findOne({userId: req.signedCookies.id});
        // Checks if the suspension is already lifted and removes it if it already is
        if(suspended && suspended.releaseDate.getTime() == (new Date()).getTime()){
            await suspended.remove()
            suspended = null;
        }
    }catch(err){
        res.status(500).send("Cannot suspend user at this schedule.");
    }
}

var schedule = require('node-schedule');
var date = new Date(2012, 11, 21, 5, 30, 0);
 
var j = schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
});
