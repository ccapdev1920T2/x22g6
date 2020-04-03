const mongoose = require("mongoose");
const Schedule = require("./models/schedule");

const dbUrl = "mongodb://localhost:27017/arrowsTest" // Temporary local database 
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}
mongoose.connect(dbUrl, dbOptions);
mongoose.connection.on("connected", () => console.log("Mongoose connected to " + dbUrl));
mongoose.connection.on("error", () => console.log("Mongoose cannot connect to " + dbUrl));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected from " + dbUrl));

(async () =>{
    try{
        // LAG-to-MNL
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
        console.log("Insert Successful");
        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1)
    }
})();