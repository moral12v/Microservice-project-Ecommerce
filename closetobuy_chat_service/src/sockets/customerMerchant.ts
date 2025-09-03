import { Server } from "socket.io";
import { userSocket } from "../middlewares/socketAuth";
import UserService from "../services/userService";
import ChatService from "../services/chatService";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

interface TypingEventData {
  receiverId: string;
  isTyping: boolean;
}

export default function initializeC2MSocket(httpServer: any) {
  const io = new Server(httpServer, { perMessageDeflate: false });
  io.use(userSocket);

  io.on("connection", async (socket: any) => {
    const user = socket.user;
    console.log(user, "user connected");

    const existingUser = await UserService.getUserById(user._id);
    if (existingUser) {
      await UserService.updateUser(user._id, {
        socketId: socket.id,
        name: user.name || user.fullName,
      });
    } else {
      await UserService.createUser(
        socket.id,
        user._id,
        user.deviceId,
        user.userType,
        user.name || user.fullName
      );
    }

    socket.broadcast.emit("isOnline", {
      userId: user._id,
      userType: user.userType,
      name: user.name || user.fullName,
      isOnline: true,
    });

    const sendChatListToUser = async () => {
      const chatList = await ChatService.getUserChatList(user._id);
      socket.emit(
        "chat-list",
        chatList.map((chat) => ({
          userId: chat._id,
          name: chat.userDetails.name,
          lastMessage: chat.lastMessage,
        }))
      );
    };

    await sendChatListToUser();

    socket.on(
      "typing-status",
      async ({ receiverId, isTyping }: TypingEventData) => {
        const receiver = await UserService.getUserById(receiverId);
        if (receiver?.socketId) {
          io.to(receiver.socketId).emit("typing-status", {
            senderId: user._id,
            isTyping,
          });
        }
      }
    );

    socket.on("send-message", async (data: ChatMessage) => {
      const { receiverId, message } = data;
      const timestamp = new Date().toISOString();
      console.log(receiverId, message, "receiverId, message");
      const chatMessage = await ChatService.sendMessage(
        user._id,
        receiverId,
        message
      );
      const receiver = await UserService.getUserById(receiverId);

      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("receive-message", chatMessage);
        const lastMessage = await ChatService.getLastMessage(
          user._id,
          receiverId
        );
        io.to(receiver.socketId).emit("last-message", lastMessage);
      }
      const senderChatList = await ChatService.getUserChatList(user._id);
      socket.emit(
        "chat-list",
        senderChatList.map((chat) => ({
          userId: chat._id,
          name: chat.userDetails.name,
          lastMessage: chat.lastMessage,
        }))
      );

      if (receiver?.socketId) {
        const receiverChatList = await ChatService.getUserChatList(receiverId);
        io.to(receiver.socketId).emit(
          "chat-list",
          receiverChatList.map((chat) => ({
            userId: chat._id,
            name: chat.userDetails.name,
            lastMessage: chat.lastMessage,
          }))
        );
      }
    });

    socket.on("get-chat-history", async (receiverId: string) => {
      const chatHistory = await ChatService.getChatHistory(
        user._id,
        receiverId
      );
      console.log(chatHistory, "chatHistorychatHistory");
      socket.emit("chat-history", chatHistory);
    });
    socket.on("disconnect", async () => {
      await UserService.updateUser(user._id, { socketId: "" });
      socket.broadcast.emit("isOnline", {
        userId: user._id,
        userType: user.userType,
        isOnline: false,
        name: user.name || user.fullName,
      });
    });
  });
}
