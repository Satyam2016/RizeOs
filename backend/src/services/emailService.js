const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: "satyam.kumarr279@gmail.com",
    pass: "ajyhfhjqeghsbbnl"
  }
});

module.exports = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"WorkChain" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
