import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import logger from '../utils/logger';

const PROTO_PATH = path.resolve(__dirname, './proto/user_service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto:any = grpc.loadPackageDefinition(packageDefinition).user;

const server = new grpc.Server();


const startgRPCServer = (): void => {
  server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        logger.error('Error starting gRPC server:', error);
      return;
    }
    logger.info(`gRPC server running at http://localhost:${port}`);
  });
};

export default startgRPCServer;