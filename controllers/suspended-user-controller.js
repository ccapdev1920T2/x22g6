const SuspendedUser = require("../models/suspended-user-model");

exports.ScheduledDeletion = async function(req, res){
    try{
        await SuspendedUser.find()
    }catch(err){
        res.status(500).send("Cannot suspend user at this schedule.");
    }
}
