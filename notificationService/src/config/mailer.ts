import nodemailer, { Transporter } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { SMTP_PORT } from '.';


const smtpPort: number = SMTP_PORT ;

const transporter: Transporter = nodemailer.createTransport(
   smtpTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      auth: {
         user: process.env.SMTP_USERNAME,
         pass: process.env.SMTP_PASSWORD, 
      },
   })
);
