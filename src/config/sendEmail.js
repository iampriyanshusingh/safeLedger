const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
async function sendEmail(to, subject, text, html, attachments = []) {
  const mailOptions = {
    from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments: attachments, // 👈 important
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
