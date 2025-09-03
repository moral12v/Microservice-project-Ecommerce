import http from 'http';
import { Server as SocketIOServer } from 'socket.io'; 
import { PORT, HOST } from './src/config';
import { registerService, removeService } from './src/services/gatewayService';
import logger from './src/utils/logger';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server for C2B\n');
});

const io = new SocketIOServer(server);

let sockets: { sid: string; data: any }[] = [];

io.on('connection', (socket) => {
  const socketId = socket.id;

  socket.on('service_data', (data) => {
    registerService(data, socketId, sockets);
    logger.info(`Service registered: ${socketId}`);
    socket.emit('ack', { message: 'Service registered successfully' });
  });

  socket.on('disconnect', () => {
    removeService(socketId, sockets);
    logger.warn(`Service removed: ${socketId}`);
  });

  logger.info(`Socket connected: ${socketId}`);
});

server.listen(PORT, HOST, () => {
  logger.info(`Server running at http://${HOST}:${PORT}/`);
});
