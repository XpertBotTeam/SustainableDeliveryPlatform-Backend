const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set your SendGrid API key

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services as well
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email username
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

module.exports = {
  sendMail: async (to, subject, text, html) => {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },

  sendGridMail: async (to, subject, text, html) => {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },
};
