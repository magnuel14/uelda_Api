const nodemailer = require('nodemailer');
const sendMail = {};
sendMail.transporter = nodemailer.createTransport({
  name: process.env.MAIL_NAME,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID, // generated ethereal user
    pass: process.env.MAIL_PASS  // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
});
// send mail with defined transport object
module.exports = sendMail;