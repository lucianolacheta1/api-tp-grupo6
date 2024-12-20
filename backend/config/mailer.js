// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar cualquier servicio de correo compatible
  auth: {
    user: 'nicolasredaelli2@gmail.com', // Replace with your email
    pass: 'llow jwjm eojc dtbt',  // Replace with your email password
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: 'nicolasredaelli2@gmail.com', // Replace with your email
    to,
    subject,
    text,
  };

  try {
    console.log(`Sending email to ${to} with subject "${subject}" and text "${text}"`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendMail;