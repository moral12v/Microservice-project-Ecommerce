import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
 

//user service
const PROTO_PATH = path.resolve(__dirname, './proto/user_service.proto');
const USER_SERVICE_PORT = 'localhost:50051';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto:any = grpc.loadPackageDefinition(packageDefinition).user;
export const userServiceClient = new userProto.UserService(USER_SERVICE_PORT, grpc.credentials.createInsecure());



// Store Service 
const STORE_SERVICE_PORT = 'localhost:50052';
const STORE_PROTO_PATH = path.resolve(__dirname, './proto/store_service.proto');
const storePackageDefinition = protoLoader.loadSync(STORE_PROTO_PATH, {});
const storeProto:any = grpc.loadPackageDefinition(storePackageDefinition).store;
export const storeServiceClient = new storeProto.StoreService(STORE_SERVICE_PORT, grpc.credentials.createInsecure());





const ORDER_SERVICE_PORT = '0.0.0.0:50055';
const ORDER_PROTO_PATH = path.resolve(__dirname, './proto/order_service.proto');
const orderPackageDefinition = protoLoader.loadSync(ORDER_PROTO_PATH , {});
const orderProto:any = grpc.loadPackageDefinition(orderPackageDefinition).order;
export const orderServiceClient = new orderProto.OrderService(ORDER_SERVICE_PORT , grpc.credentials.createInsecure());
