import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import logger from '../utils/logger';
import { orderDetails } from './controller/orderDetails';

const PROTO_PATH = path.resolve(__dirname, './proto/order_service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const orderProto:any = grpc.loadPackageDefinition(packageDefinition).order;

const server = new grpc.Server();
server.addService(orderProto.OrderService.service, { orderDetails });
const startgRPCServer = (): void => {
  server.bindAsync('0.0.0.0:50055', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        logger.error('Error starting gRPC server:', error);
      return;
    }
    logger.info(`gRPC server running at http://localhost:${port}`);
  });
};

export default startgRPCServer;