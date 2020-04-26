const SuspendedUser = require("../models/suspended-user-model");
const schedule = require("node-schedule");
//Schedules deletion of the suspension of suspended users
 async function ScheduledDeletion(){
    try{
         let suspended = await SuspendedUser.find();
        for(let i=0; i<suspended.length; i++){
            schedule.scheduleJob(suspended[i].releaseDate, function(){
                suspended[i].remove(function(err, product){
                    console.log(product);
                    if(err)
                        console.log(`Cannot lift suspension of ${suspended[i]}: ${err}`);
                    else
                        console.log(`Lifted suspension of ${suspended[i]}`);
                });
            });
        }
    }catch(err){
        console.log(err);
    }
}
ScheduledDeletion();
