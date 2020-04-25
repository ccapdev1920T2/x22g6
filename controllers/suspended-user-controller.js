const SuspendedUser = require("../models/suspended-user-model");

let SuspendedUserCollection = SuspendedUser.find();

exports.ScheduledDeletion = async function(req, res){
    try{
        
    }catch(err){
        res.status(500).send("Cannot suspend user at this schedule.");
    }
}
