import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8512', 10);
export const HOST = process.env.HOST || '0.0.0.0';



export const CUSTOMER_MERCHANT_SOCKET_PORT = parseInt(process.env.PORT || '8788', 10);

export const SOCKET_SERVER_URL: string = process.env.SOCKET_SERVER_URL || 'http://0.0.0.0:8501'; 



export const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
export const MONGODB_PORT = parseInt(process.env.MONGODB_PORT || '27017', 10);
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'chat_services';