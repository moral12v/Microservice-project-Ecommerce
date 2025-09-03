import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.resolve(__dirname, './proto/user_service.proto');
 
const USER_SERVICE_PORT = 'localhost:50051';


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto:any = grpc.loadPackageDefinition(packageDefinition).user;
export const userServiceClient = new userProto.UserService(USER_SERVICE_PORT, grpc.credentials.createInsecure());


 


// Inventory Service 
const INVENTORY_SERVICE_PORT = 'localhost:50053';
const INVENTORY_PROTO_PATH = path.resolve(__dirname, './proto/inventory_service.proto');
const inventoryPackageDefinition = protoLoader.loadSync(INVENTORY_PROTO_PATH, {});
const inventoryProto:any = grpc.loadPackageDefinition(inventoryPackageDefinition).inventory;
export const inventoryServiceClient = new inventoryProto.InventoryService(INVENTORY_SERVICE_PORT, grpc.credentials.createInsecure());

