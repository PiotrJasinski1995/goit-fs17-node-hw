const nodemailer = require("nodemailer");

const sendVerification = async (user) => {
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
    to: user.email, // list of receivers
    subject: "Verify email", // Subject line
    html: `
      <p>Hello,</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Verify Your Email</a>
      <br /><p>Your Verification Bot</p>
    `, // html body
  };

  try {
    await transporter.sendMail(emailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = { sendVerification };
