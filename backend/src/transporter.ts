import nodemailer from 'nodemailer';

const isProduction = process.env.NODE_ENV == 'production';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: isProduction,
  auth: isProduction
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
});

export default transporter;
