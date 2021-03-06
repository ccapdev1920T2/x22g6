const mongoose = require("mongoose");

const uri = process.env.DB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}

module.exports.connect = function(){
    return mongoose.connect(uri, options);
}

module.exports.connection = mongoose.connection;

mongoose.connection.on("connected", () => console.log("Connected to MongoDB server"));
mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB server"));
mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB server"));