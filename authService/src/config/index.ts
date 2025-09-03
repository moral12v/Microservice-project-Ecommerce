import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8502', 10);
export const HOST = process.env.HOST || '0.0.0.0';
export const SOCKET_SERVER_URL: string = process.env.SOCKET_SERVER_URL || 'http://0.0.0.0:8501'; 

export const API_SECRET = process.env.API_SECRET || 'vvvv23223nzx';


