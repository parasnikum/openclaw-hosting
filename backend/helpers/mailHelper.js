const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ,
    port: process.env.MAIL_PORT ,
    // secure: true,
    pool: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendProEmail = async (to, subject, templateName, placeholders = {}) => {
    try {
        const templatePath = path.join(__dirname, '../mailTemplates', templateName);
        
        let htmlContent = await fs.readFile(templatePath, 'utf8');
        
        Object.keys(placeholders).forEach((key) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            htmlContent = htmlContent.replace(regex, placeholders[key]);
        });

        const mailOptions = {
            from: `no-reply@berrybox.cloud`,
            to,
            subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("Email Helper Error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = sendProEmail;