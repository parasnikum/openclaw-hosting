const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 465,
    secure: true, 
    pool: true,
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
    },
});

const sendProEmail = async (to, subject, templateName, placeholders = {}) => {
    try {
        // 1. Resolve path to template
        // Using path.join is safer than hardcoded Windows strings for deployment
        const templatePath = path.join(__dirname, '../mailTemplates', templateName);
        
        // 2. Read the HTML file
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        // 3. Automatically replace all placeholders
        // If template has {{username}}, this looks for placeholders.username
        Object.keys(placeholders).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, placeholders[key]);
        });

        // 4. Mail Options
        const mailOptions = {
            from: `"Zyrox Cloud" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
            // You can also add a plain text version by stripping HTML if desired
        };

        // 5. Send the mail
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email Sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error("Email Helper Error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = sendProEmail;