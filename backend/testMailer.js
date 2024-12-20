// testMailer.js
const nodemailer = require('nodemailer');
const sendMail = require('./config/mailer');

// Cargar las variables de entorno desde el archivo .env
nodemailer.createTransport({
    host: "smtp.example.com",
    port: 465,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "nicolasredaelli2@gmail.com",
      pass: "llow jwjm eojc dtbt",
    },
  });

const testEmail = async () => {
  try {
    const to = 'nicolasredaelli0@gmail.com'; // Replace with a valid email address
    const subject = 'Test Email';
    const text = 'This is a test email to verify the nodemailer setup.';

    await sendMail(to, subject, text);
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

testEmail();