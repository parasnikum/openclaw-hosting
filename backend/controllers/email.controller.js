const Mail = require("../services/mail.service");
const Templates = require("../utils/emailTemplates");

exports.sendVerify = async (user) => {
  await Mail.sendMail({
    to: user.email,
    subject: "Verify Email",
    html: Templates.verifyEmail("link")
  });
};
