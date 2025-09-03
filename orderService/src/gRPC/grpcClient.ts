import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';


//user service client
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




// Inventory Service 
const INVENTORY_SERVICE_PORT = 'localhost:50053';
const INVENTORY_PROTO_PATH = path.resolve(__dirname, './proto/inventory_service.proto');
const inventoryPackageDefinition = protoLoader.loadSync(INVENTORY_PROTO_PATH, {});
const inventoryProto:any = grpc.loadPackageDefinition(inventoryPackageDefinition).inventory;
export const inventoryServiceClient = new inventoryProto.InventoryService(INVENTORY_SERVICE_PORT, grpc.credentials.createInsecure());



// Shipping Service 
const SHIPPING_SERVICE_PORT = 'localhost:50018';
const SHIPPING_PROTO_PATH = path.resolve(__dirname, './proto/shipping_service.proto');
const shippingPackageDefinition = protoLoader.loadSync(SHIPPING_PROTO_PATH, {});
const shippingProto: any = grpc.loadPackageDefinition(shippingPackageDefinition).shippingservice;
export const shippingServiceClient = new shippingProto.ShippingService(SHIPPING_SERVICE_PORT, grpc.credentials.createInsecure());


const NOTIFICATION_SERVICE_PORT = 'localhost:50019'; 
const NOTIFICATION_PROTO_PATH = path.resolve(__dirname, './proto/notification_service.proto');
const notificationPackageDefinition = protoLoader.loadSync(NOTIFICATION_PROTO_PATH, {});
const notificationProto: any = grpc.loadPackageDefinition(notificationPackageDefinition).notificationservice;
export const notificationServiceClient = new notificationProto.NotificationService(NOTIFICATION_SERVICE_PORT, grpc.credentials.createInsecure());