import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8511', 10);
export const HOST = process.env.HOST || '0.0.0.0';


export const SOCKET_SERVER_URL: string = process.env.SOCKET_SERVER_URL || 'http://0.0.0.0:8501'; 

export const DUNZO_TOKEN_API_URL: string =  process.env.DUNZO_TOKEN_API_URL|| 'https://api.dunzo.in/api/v1/token'
export const DUNZO_GETQUOTE_SHIPPING_PRICE_API_URL: string =  process.env.DUNZO_GETQUOTE_SHIPPING_PRICE_API_URL || 'https://api.dunzo.in/api/v2/quote'
export const DUNZO_CREATE_TASK_API_URL: string =  process.env.DUNZO_CREATE_TASK_API_URL || 'https://api.dunzo.in/api/v2/tasks'
export const DUNZO_TRACK_ORDER_API_URL: string =  process.env.DUNZO_TRACK_ORDER_API_URL || 'https://api.dunzo.in/api/v1/tasks'
export const DUNZO_CANCEL_TASK_API_URL: string =  process.env.DUNZO_CANCEL_TASK_API_URL|| 'https://api.dunzo.in/api/v1/tasks'


export const FLASH_BASE_URL: string = process.env.FLASH_BASE_URL || '';
export const FLASH_GET_SERVICIBILITY: string = process.env.FLASH_GET_SERVICIBILITY || '';
export const FLASH_ACCESS_TOKEN: string = process.env.FLASH_ACCESS_TOKEN || '';
export const FLASH_PARENT_ID: string = process.env.FLASH_PARENT_ID || '';
export const FLASH_STORE_ID: string = process.env.FLASH_STORE_ID || '';

export const FLASH_CANCEL_ORDER = process.env.FLASH_CANCEL_ORDER;
export const FLASH_CREATE_ORDER = process.env.FLASH_CREATE_ORDER;
export const FLASH_TRACK_ORDER = process.env.FLASH_TRACK_ORDER;





