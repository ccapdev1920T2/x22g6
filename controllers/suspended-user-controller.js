const SuspendedUser = require("../models/suspended-user-model");
const schedule = require("node-schedule");
//Schedules deletion of the suspension of suspended users
exports.ScheduledDeletion = async function(req, res){
    try{
         let suspended = await SuspendedUser.findOne({userId: req.signedCookies.id});
        for(let i=0; i< suspended.length; i++){
            schedule.scheduleJob(suspended.releaseDate.getTime(), )
        }
            res.status(204).send;
    }catch(err){
        res.status(500).send("Cannot suspend user at this schedule.");
    }
}
