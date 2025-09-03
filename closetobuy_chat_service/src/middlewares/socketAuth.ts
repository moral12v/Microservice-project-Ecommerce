import { NextFunction } from "express";
import { ExtendedError } from "socket.io/dist/namespace";
import { authenticateUser } from "../gRPC/controller/authenticateUser";
import { Span, trace } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { authenticateMerchant } from "../gRPC/controller/merchantAuth";

export const userSocket = async (
  socket: any,
  next: (err?: ExtendedError) => void
): Promise<void> => {
  try {
    const token: string = socket?.handshake?.query?.authToken;
    const userType: string = socket?.handshake?.query?.userType;
    const tracer = trace.getTracer("chat-service");
    const span: Span = tracer.startSpan("customerAuthentication");
    const metadata = new Metadata();
    if (!token) {
      socket.disconnect();
      return;
    }

    if (userType === "CUSTOMER") {
      const authResponse = await authenticateUser(token, span, metadata);
      if (!authResponse.isValid) {
        socket.disconnect();
        return;
      }
      socket.user = { ...authResponse.customerData, userType };
      next();
    } else if (userType === "MERCHANT") {
      const authResponse: any = await authenticateMerchant(token, span, metadata);
      console.log(authResponse, "authResponse authResponse authResponse ");
      if (!authResponse.isValid) {
        socket.disconnect();
        return;
      }
      socket.user = { ...authResponse.merchantData, userType };
      next();
    } else {
      socket.disconnect();
    }
  } catch (error) {
    socket.disconnect();
  }
};
