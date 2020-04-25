const SuspendedUser = require("../models/suspended-user-model");

//Schedules deletion of the suspension of suspended users
exports.ScheduledDeletion = async function(req, res){
    try{
         let suspended = await SuspendedUser.findOne({userId: req.signedCookies.id});
         let suspensionReleaseDate = suspended.releaseDate.getTime();
        
        if(suspended && suspensionReleaseDate == (new Date()).getTime()){
            await suspended.remove()
            suspended = null;
            res.status(204).send;
        }
    }catch(err){
        res.status(500).send("Cannot suspend user at this schedule.");
    }
}
