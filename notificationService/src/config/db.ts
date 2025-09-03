import mongoose, { Connection } from 'mongoose';
import { MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE } from '../config';

mongoose.set('debug', false);
mongoose.set('strictQuery', false);

let dbConnection: Connection | null = null;

const connectionString = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(connectionString);
        dbConnection = conn.connection;
        console.log(`MongoDB Connected with:`, dbConnection.db.namespace);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async (): Promise<void> => {
    try {
        if (dbConnection) {
            await mongoose.disconnect();
            console.log('MongoDB Disconnected');
        } else {
            console.log('No active MongoDB connection to disconnect.');
        }
    } catch (error: any) {
        console.error(`Error disconnecting from MongoDB: ${error.message}`);
    }
};

export { connectDB, disconnectDB };
