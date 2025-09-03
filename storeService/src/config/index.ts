import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8505', 10);
export const HOST = process.env.HOST || '0.0.0.0';

export const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
export const MONGODB_PORT = parseInt(process.env.MONGODB_PORT || '27017', 10);
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'store_services';

export const SOCKET_SERVER_URL: string = process.env.SOCKET_SERVER_URL || 'http://0.0.0.0:8501'; 

export const API_SECRET = process.env.API_SECRET || 'vvvv23223nzx';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'vvvv23223nzx';

export const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || 'https://ctbstorage.blob.core.windows.net/;QueueEndpoint=https://ctbstorage.queue.core.windows.net/;FileEndpoint=https://ctbstorage.file.core.windows.net/;TableEndpoint=https://ctbstorage.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-01-01T15:11:10Z&st=2024-07-17T07:11:10Z&spr=https,http&sig=tVzM3eZX9LAwjGavTHJRmv0g5%2BNAbBRi9taNdUMvBY8%3D';
export const CONTAINER_NAME = process.env.CONTAINER_NAME || 'dev';
