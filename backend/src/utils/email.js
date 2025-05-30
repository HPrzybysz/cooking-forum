const nodemailer = require('nodemailer');
const logger = require('./logger');

const isProduction = process.env.NODE_ENV === 'production';

const createTransport = () => {
    const baseConfig = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        logger: true,
        debug: process.env.NODE_ENV !== 'production'
    };

    if (process.env.NODE_ENV === 'development') {
        return nodemailer.createTransport({
            ...baseConfig,
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            }
        });
    }

    return nodemailer.createTransport({
        ...baseConfig,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        tls: {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.3'
        }
    });
};

const transporter = createTransport();

transporter.verify((error) => {
    if (error) {
        logger.error('SMTP con failed:', error);
    } else {
        logger.info('SMTP con ok');
    }
});

async function sendPasswordResetEmail(email, token) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Click below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}" 
           style="background: #4285F4; color: white; 
                  padding: 10px 15px; text-decoration: none;
                  border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p style="color: #777; font-size: 12px; margin-top: 20px;">
          This link expires in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${email}`, {messageId: info.messageId});
        return true;
    } catch (error) {
        logger.error('Email sending failed', {
            error: error.message,
            stack: error.stack,
            email
        });
        return false;
    }
}

module.exports = {sendPasswordResetEmail};