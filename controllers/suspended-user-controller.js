const SuspendedUser = require("../models/suspended-user-model");
const schedule = require("node-schedule");
//Schedules deletion of the suspension of suspended users
module.exports.scheduleReleaseDate =  async function scheduleReleaseDate(){
    try{
        let suspended = await SuspendedUser.find();
        for(let i=0; i<suspended.length; i++){
            let today = new Date();
            if(suspended[i].releaseDate.getTime() <= today.getTime())
                suspended[i].liftSuspension();
            else{
                schedule.scheduleJob(suspended[i].releaseDate, function(){
                    suspended[i].liftSuspension();
                });
            }
        }
        console.log("Scheduled release date of existing suspended users");
    }catch(err){
        console.log("Cannot schedule release date of existing suspended users :" + err);
    }
}
