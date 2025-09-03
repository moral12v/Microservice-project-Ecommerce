import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT || "8509", 10);
export const HOST = process.env.HOST || "0.0.0.0";

// PostgreSQL DOCKER CONFRIGURATION 
export const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || "5433", 10);
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "ctb_order";
export const POSTGRES_USER = process.env.POSTGRES_USER || "postgresuser";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "postgrespass";


// POSTGRESQL LOCAL SYSTEM CONFRIGURATION 
// export const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
// export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || "5432", 10);
// export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "ctb_order";
// export const POSTGRES_USER = process.env.POSTGRES_USER || "ctb_db_user";
// export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "Expert@001";

export const SOCKET_SERVER_URL: string =
  process.env.SOCKET_SERVER_URL || "http://0.0.0.0:8501";

export const OTP_SEND_URL =
  process.env.OTP_SEND_URL || "https://control.msg91.com/api/v5/otp";
