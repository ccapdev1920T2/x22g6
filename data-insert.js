const mongoose = require("mongoose");
const User = require("./models/user-model");
const Schedule = require("./models/schedule-model");
const Reservation = require("./models/reservation-model");
const SuspendedUsers = require("./models/suspended-user-model");

//Database Connection
const dbUrl = "mongodb://localhost:27017/arrows-express"
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
};

(async () => {
    try{
        console.log("Connecting to " + dbUrl + "...");
        await mongoose.connect(dbUrl, dbOptions);
        console.log("Connected to " + dbUrl + ".");
        //Deletes all existing data in the arrows-express db
        await mongoose.connection.dropDatabase();

        //LAG-to-MNL
        await new Schedule({time: 545, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 700, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 730, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 900, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 1100, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 1300, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 1430, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 1530, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 1700, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        await new Schedule({time: 1815, origin: Schedule.LAG, destination: Schedule.MNL}).save();
        // MNL-to-LAG
        await new Schedule({time: 600, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 730, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 930, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 1100, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 1300, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 1430, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 1530, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 1700, origin: Schedule.MNL, destination: Schedule.LAG}).save();
        await new Schedule({time: 1815, origin: Schedule.MNL, destination: Schedule.LAG}).save();

        console.log("Inserted schedule documents.");
        await User.createUser(11826532, "Mike", "Quito", "mike_quito@dlsu.edu.ph", "headphones", User.STAFF_TYPE);
        await User.createUser(11825647, "Joshua", "Gaurano", "joshua_gaurano@dlsu.edu.ph", "mousepad", User.STUDENT_TYPE);
        await User.createUser(11829672, "JJ", "Reyes", "jj_reyes@dlsu.edu.ph", "computers", User.STUDENT_TYPE);
        console.log("Inserted user documents.");

        console.log("Data successfuly inserted.");
        process.exit()
    }catch(err){
        console.log(err);
        console.log("Failed to insert data");
        process.exit(1);
    }
})();