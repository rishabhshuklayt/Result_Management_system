// mailer.js

const nodemailer = require('nodemailer');
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'spiderweb07man@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

module.exports = transporter;
