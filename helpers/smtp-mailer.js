const nodemailer = require("nodemailer");

let options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

/*
    Connects to the SMTP server.  Returns a promise that resolves to the SMTP transporter if connection is successful.  
    If the SMTP transporter exists, it simply resolves to the existing SMTP transporter
*/
module.exports.connect = function(){
    return new Promise(function(resolve, reject){
        if(!module.exports.transporter){
            module.exports.transporter = nodemailer.createTransport(options);
            module.exports.transporter.verify(function(err, success){
                if(err) 
                    reject(err);
                else
                    resolve(module.exports.transporter);
            });
        }else
            resolve(module.exports.transporter);
    });
}