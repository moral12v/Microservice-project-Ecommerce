import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import { POSTGRES_DATABASE } from ".";

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info(`Successfully connected to the database ${POSTGRES_DATABASE}.`);
  } catch (error: any) {
    logger.error(`Error connecting to the database ${POSTGRES_DATABASE}: ${error.message}`);
    throw error;
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info("Database connection closed.");
  } catch (error: any) {
    logger.error(`Error disconnecting from the database: ${error.message}`);
  }
};

export default prisma;
