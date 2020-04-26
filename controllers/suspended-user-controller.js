const SuspendedUser = require("../models/suspended-user-model");
const schedule = require("node-schedule");
//Schedules deletion of the suspension of suspended users
 async function ScheduledDeletion(){
    try{
         let suspended = await SuspendedUser.find();
        for(let i=0; i<suspended.length; i++){
            schedule.scheduleJob(suspended[i].releaseDate, function(){
                suspended[i].remove();
            }
        }
    }catch(err){
        console.log(err);
    }
}
ScheduledDeletion();
