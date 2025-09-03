import Chat, { ChatDoc } from "../models/chatModel";

class ChatRepository {
  async createChat(senderId: string, receiverId: string, message: string): Promise<ChatDoc> {
    const chatMessage = await Chat.create({
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });
    return chatMessage;
  }

  async getChatList(userId: string): Promise<any[]> {
    return Chat.getChatList(userId);
  }

  async getLastMessage(senderId: string, receiverId: string): Promise<ChatDoc | null> {
    return Chat.getLastMessage(senderId, receiverId);
  }

  async getChatHistory(userId: any, receiverId: string): Promise<ChatDoc[]> {
    return Chat.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });
  }
}

export default new ChatRepository();
