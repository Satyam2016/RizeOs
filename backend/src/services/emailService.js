const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or another provider like "SendGrid"
  auth: {
    user: "satyam.kumarr279@gmail.com",
    pass: "ajyhfhjqeghsbbnl"
  }
});

module.exports = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"SkillSync" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
