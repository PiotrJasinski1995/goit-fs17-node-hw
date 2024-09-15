const nodemailer = require("nodemailer");

const sendVerification = (user) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: "Verification Bot <verification@gmail.com>", // sender address
    to: "siny955@wp.pl", // list of receivers
    subject: "Verify email", // Subject line
    html: `
      <p>Hello,</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Verify Your Email</a>
      <br /><p>Your Verification Bot</p>
    `, // html body
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Verification email send");
    }
  });
};

module.exports = { sendVerification };
