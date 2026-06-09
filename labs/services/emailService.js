const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

/**
 * Sends an email using Gmail service and an EJS template.
 * @param {string} template - Name of the template file without the .ejs extension.
 * @param {object} data - The template variables.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject line.
 * @returns {Promise<any>} - NodeMailer sendMail info.
 */
const sendEmail = async (template, data, to, subject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const templatePath = path.resolve(__dirname, '..', 'views', 'emails', `${template}.ejs`);

  // Render the EJS template with data
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  // Send the email and let errors bubble up to the global handler
  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = {
  sendEmail
};
