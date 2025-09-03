import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import logger from "../utils/logger";
import { authenticateMerchant } from "./controller/merchantAuth";
import { getMerchantDetailsById } from "./controller/merchantDetails";
import { getDeliveryDetailsById } from "./controller/deliveryType";
import { getDeviceDetailsByStoreId } from "./controller/deviceId";

const PROTO_PATH = path.resolve(__dirname, "./proto/store_service.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const storeProto: any = grpc.loadPackageDefinition(packageDefinition).store;

const server = new grpc.Server();
server.addService(storeProto.StoreService.service, { authenticateMerchant, getMerchantDetailsById,getDeliveryDetailsById,getDeviceDetailsByStoreId });

const startgRPCServer = (): void => {
  server.bindAsync(
    "0.0.0.0:50052",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error("Error starting gRPC server:", error);
        return;
      }
      logger.info(`gRPC server running at http://localhost:${port}`);
    }
  );
};

export default startgRPCServer;
