import express from "express";
import bodyParser from "body-parser";
import { logMiddleware } from "./src/middlewares/logMiddleware";
import {
  PORT,
  HOST,
  SOCKET_SERVER_URL,
  CUSTOMER_MERCHANT_SOCKET_PORT,
} from "./src/config";
import logger from "./src/utils/logger";
import { connectDB } from "./src/config/db";
import io from "socket.io-client";
import notFoundMiddleware from "./src/middlewares/notFoundMiddleware";
import routes from "./src/routes";
import http from "http";
import initializeC2MSocket from "./src/sockets/customerMerchant";

const app = express();
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

app.use(bodyParser.json());
app.use(logMiddleware);

app.use("/", routes);

app.use(notFoundMiddleware);

const registerServiceWithGateway = async () => {
  const data = {
    app: "chats",
    port: PORT,
    accepted_methods: ["GET", "POST", "PATCH", "DELETE"],
    protocol: "http",
    domain: HOST,
  };
  return new Promise<void>((resolve, reject) => {
    socket.on("connect", () => {
      logger.info("Connected to gateway via socket");
      socket.emit("service_data", data);
    });
    socket.on("disconnect", () => {
      logger.warn("Disconnected from gateway via socket");
    });
    socket.on("error", (error) => {
      logger.error(`Socket error: ${error}`);
      reject(error);
    });

    socket.on("ack", (acknowledgement) => {
      logger.info(
        `Service registered with gateway: ${acknowledgement.message}`
      );
      resolve();
    });
  });
};
const startServer = async () => {
  try {
    logger.info("MongoDB connected successfully.");
    await connectDB();
    app.listen(PORT, HOST, () => {
      logger.info(`Server is running on http://${HOST}:${PORT}`);
    });
    await registerServiceWithGateway();
    logger.info("Service registered with gateway via socket.");
  } catch (error: any) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};
startServer();

const socketServer = http.createServer();
initializeC2MSocket(socketServer);
socketServer.listen(CUSTOMER_MERCHANT_SOCKET_PORT as number, "0.0.0.0", () => {
  console.log(
    `\x1b[36m%s\x1b[0m`, 
    `\n=================================================\n` +
      `🎉   C2M Socket server is running on port \x1b[32m${CUSTOMER_MERCHANT_SOCKET_PORT}\x1b[36m!\n` + 
      `=================================================\n`
  );
});

process.on("SIGINT", () => {
  logger.info("Graceful shutdown initiated...");
  socket.close();
  logger.info("Socket closed");
  process.exit(0);
});
