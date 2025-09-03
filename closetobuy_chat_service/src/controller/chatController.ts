import { Request, Response } from "express";
import ChatService from "../services/chatService";
import { authenticateUser } from "../gRPC/controller/authenticateUser";
import { Span, trace } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { responseWithoutData } from "../utils/response";
import { authenticateMerchant } from "../gRPC/controller/merchantAuth";

class ChatController {
  async getChatHistory(req: Request, res: Response) {
    const { receiverId } = req.params;
    const token = req.headers["authorization"];
    const tracer = trace.getTracer("chat-service");
    const span: Span = tracer.startSpan("customerAuthentication");
    const metadata = new Metadata();
    if (!token) {
      return responseWithoutData(
        res,
        401,
        false,
        "Invalid Authorization Token"
      );
    }
    const user = await authenticateUser(token, span, metadata);
    const userId = user.customerData?._id.toString();
    try {
      const chatHistory = await ChatService.getChatHistory(userId, receiverId);
      if (!chatHistory.length) {
        return res.status(404).json({ message: "No chat history found." });
      }

      return res.status(200).json(
        chatHistory.map((chat) => ({
          senderId: chat.senderId,
          receiverId: chat.receiverId,
          message: chat.message,
          timestamp: chat.timestamp,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
  async getMerchantChatHistory(req: Request, res: Response) {
    const { receiverId } = req.params;
    const token = req.headers["authorization"];
    const tracer = trace.getTracer("chat-service");
    const span: Span = tracer.startSpan("customerAuthentication");
    const metadata = new Metadata();
    if (!token) {
      return responseWithoutData(
        res,
        401,
        false,
        "Invalid Authorization Token"
      );
    }
    const authResponse: any = await authenticateMerchant(token, span, metadata);
    const userId = authResponse.merchantData?._id.toString();
    try {
      const chatHistory = await ChatService.getChatHistory(userId, receiverId);
      if (!chatHistory.length) {
        return res.status(404).json({ message: "No chat history found." });
      }

      return res.status(200).json(
        chatHistory.map((chat) => ({
          senderId: chat.senderId,
          receiverId: chat.receiverId,
          message: chat.message,
          timestamp: chat.timestamp,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}

export default new ChatController();
