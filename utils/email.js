const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // define email options
  const mailOption = {
    from: 'Yohannes Takata <yohannestakata1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // send the email
  await transporter.sendMail(mailOption);
};

module.exports = sendMail;
