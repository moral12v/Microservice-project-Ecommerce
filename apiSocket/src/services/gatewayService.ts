import axios from 'axios';
import { GATEWAY_REGISTER_API_URL, GATEWAY_REMOVE_API_URL } from '../config';

interface SocketData {
  app: string;
}

export const registerService = async (data: SocketData, sid: string, sockets: { sid: string; data: any }[]) => {
  try {
    const response = await axios.post(GATEWAY_REGISTER_API_URL, data);
    if (response?.status === 200) {
      console.log(`${data.app} is registered in gateway.`);
      sockets.push({ sid, data });
    }
  } catch (error:any) {
    console.error(error.message);
  }
};

export const removeService = async (sid: string, sockets: { sid: string; data: any }[]) => {
  try {
    const socketData = sockets.find((e) => e.sid === sid);
    if (socketData) {
      const response = await axios.post(GATEWAY_REMOVE_API_URL, { app: socketData.data.app });
      if (response?.status === 200) {
        const index = sockets.findIndex((e) => e.sid === sid);
        sockets.splice(index, 1);
        console.log(`${socketData.data.app} is removed from gateway.`);
      }
    }
  } catch (error:any) {
    console.error(error.message);
  }
};
