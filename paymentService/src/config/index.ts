import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT || "8510", 10);
export const HOST = process.env.HOST || "0.0.0.0";

// // PostgreSQL  DOCKER Configuration
// export const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
// export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || "5433", 10);
// export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "ctb_payment";
// export const POSTGRES_USER = process.env.POSTGRES_USER || "postgresuser";
// export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "postgrespass";




// PostgreSQL Configuration
export const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || "5432", 10);
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "ctb_payment";
export const POSTGRES_USER = process.env.POSTGRES_USER || "ctb_db_user";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "Expert@001";


    

export const RAZORPAY_KEY_ID =  "rzp_test_fJ8IhBGINVmb9k";
export const RAZORPAY_KEY_SECRET = "KkekfeznsUyfnKgky2AamUiP";


export const SOCKET_SERVER_URL: string =
  process.env.SOCKET_SERVER_URL || "http://0.0.0.0:8501";


  export const CALLBACK_URL: string =
  process.env.CALLBACK_URL || "http://api-dev.closetobuy.com/c2b/payments/v1/payment/confirmation";
