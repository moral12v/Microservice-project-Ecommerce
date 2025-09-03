import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import logger from "../utils/logger";
import { priceDetails } from "./controller/priceDetails";
import { subCategoryDetails } from "./controller/subCategoryDetails";


const PROTO_PATH = path.resolve(__dirname, "./proto/inventory_service.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const inventoryProto: any = grpc.loadPackageDefinition(packageDefinition).inventory;

const server = new grpc.Server();

server.addService(inventoryProto.InventoryService.service, { priceDetails,subCategoryDetails });
const startgRPCServer = (): void => {
  server.bindAsync(
    "0.0.0.0:50053",
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