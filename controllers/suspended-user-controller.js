const SuspendedUser = require("../models/suspended-user-model");
const schedule = require("node-schedule");
//Schedules deletion of the suspension of suspended users
async function scheduleReleaseDate(){
    try{
        let suspended = await SuspendedUser.find();
        for(let i=0; i<suspended.length; i++){
            schedule.scheduleJob(suspended[i].releaseDate, function(){
                suspended[i].liftSuspension().then(function(value){
                    console.log(`Lifted suspension of ${suspended[i]}`);
                }, function(err){
                    console.log(`Cannot lift suspension of ${suspended[i]}: ${err}`);
                });
            });
        }
        console.log("Scheduled release date of existing suspended users");
    }catch(err){
        console.log("Cannot schedule release date of existing suspended users :" + err);
    }
}
scheduleReleaseDate();
