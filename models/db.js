const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/arrows-express";
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}

module.exports.connect = function(){
    return mongoose.connect(uri, options);
}