import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { authenticateUser } from './controller/customerAuth';
import { authenticateAggregator } from './controller/aggregatorAuth';
import { getCustomerDetailsById } from './controller/customerDetails';
import { getAddressDetailsById } from './controller/addressDetails';
import { getDeviceDetailsByUserId } from './controller/deviceId';

const PROTO_PATH = path.resolve(__dirname, './proto/user_service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  authenticateUser,
  authenticateAggregator,
  getCustomerDetailsById,
  getAddressDetailsById,
  getDeviceDetailsByUserId
});
const startgRPCServer = (): void => {
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Error starting gRPC server:', error);
      return;
    }
    console.log(`gRPC server running at http://localhost:${port}`);
  });
};

export default startgRPCServer;
