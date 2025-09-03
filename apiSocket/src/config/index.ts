import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || '8501', 10);
export const HOST: string = process.env.HOST || '0.0.0.0'; 
export const GATEWAY_REGISTER_API_URL: string = process.env.GATEWAY_REGISTER_API_URL || 'http://0.0.0.0:8500/register';
export const GATEWAY_REMOVE_API_URL: string = process.env.GATEWAY_REMOVE_API_URL || 'http://0.0.0.0:8500/remove';
