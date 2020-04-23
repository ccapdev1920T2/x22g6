const nodemailer = require("nodemailer");

let options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

module.exports.transporter = nodemailer.createTransport(options);