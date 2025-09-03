import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8506', 10);
export const HOST = process.env.HOST || '0.0.0.0';

export const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
export const MONGODB_PORT = parseInt(process.env.MONGODB_PORT || '27017', 10);
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'inventory_services';

export const SOCKET_SERVER_URL: string = process.env.SOCKET_SERVER_URL || 'http://0.0.0.0:8501'; 


export const API_SECRET = process.env.API_SECRET || 'vvvv23223nzx';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'vvvv23223nzx';
