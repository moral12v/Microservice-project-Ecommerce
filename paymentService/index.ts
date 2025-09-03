import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { connectToDatabase, disconnectFromDatabase } from "./src/config/db";
import { logMiddleware } from "./src/middlewares/logMiddleware";
import routes from "./src/routes";
import { PORT, HOST, SOCKET_SERVER_URL } from "./src/config";
import logger from "./src/utils/logger";
import io from "socket.io-client";
import { initProducer } from "./src/kafka/producer";
import { initConsumer } from "./src/kafka/consumer";
import'./tracing'

const app = express();
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

app.use(bodyParser.json());
app.use(logMiddleware);

app.use("/", routes);

const registerServiceWithGateway = async () => {
  const data = {
    app: "payments",
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
    await connectToDatabase();
    await initProducer();
    await initConsumer();
    app.listen(PORT, HOST, () => {
      logger.info(`Server is running on http://${HOST}:${PORT}`);
    });
    await registerServiceWithGateway();
    logger.info("Service registered with gateway via socket.");
  } catch (error: any) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
};

startServer();

process.on("SIGINT", () => {
  socket.close();
  logger.info("Socket closed");
  process.exit(0);
});
