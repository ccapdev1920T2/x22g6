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