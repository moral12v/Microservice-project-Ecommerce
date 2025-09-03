import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8504', 10);
export const HOST = process.env.HOST || '0.0.0.0';

export const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
export const MONGODB_PORT = parseInt(process.env.MONGODB_PORT || '27017', 10);
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'notification_services';

export const SOCKET_SERVER_URL: string = process.env.SOCKET_SERVER_URL || 'http://0.0.0.0:8501'; 

export const OTP_SEND_URL= process.env.OTP_SEND_URL || "https://control.message91.com/api/v5/otp";
export const message91_OTP_TEMP_ID= process.env.message91_OTP_TEMP_ID || "653798add6fc053e1c6ca422";
export const message91_AUTH_KEY = process.env.message91_AUTH_KEY || "408138AgC0dhWTx3Sp65377898P1";

export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID ||"NOTIFICATION-SERVICE-CLIENT";
export const KAFKA_BROKER_PROT =parseInt(process.env.KAFKA_BROKER_PROT || '9092', 10) ;


export const SMTP_HOST = process.env.SMTP_HOST || 'mail.closetobuy.com'
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
export const SMTP_USERNAME = process.env.SMTP_USERNAME || 'admin@closetobuy.com'
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '2024@Closetobuy'



/************************************
    FIREBASE SERVER KEY CONFIGRATIONS
************************************/

export const FIREBASE_SERVER_KEY = process.env.hasOwnProperty('FIREBASE_SERVER_KEY') ? process.env.FIREBASE_SERVER_KEY: ''; 
