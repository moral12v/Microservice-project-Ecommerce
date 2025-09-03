import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { USER_SERVICE_gRPC_SERVER_PORT } from 'src/config';

const PROTO_PATH = path.resolve(__dirname, './proto/user_service.proto');
 



const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto:any = grpc.loadPackageDefinition(packageDefinition).user;


const userClient = new userProto.UserService(USER_SERVICE_gRPC_SERVER_PORT, grpc.credentials.createInsecure());

export default userClient;
 