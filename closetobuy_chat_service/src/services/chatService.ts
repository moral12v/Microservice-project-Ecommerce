import ChatRepository from "../repositories/chatRepository";

class ChatService {
  async sendMessage(senderId: string, receiverId: string, message: string) {
    const chatMessage = await ChatRepository.createChat(senderId, receiverId, message);
    return chatMessage;
  }

  async getUserChatList(userId: string) {
    return ChatRepository.getChatList(userId);
  }

  async getLastMessage(senderId: string, receiverId: string) {
    return ChatRepository.getLastMessage(senderId, receiverId);
  }
  async getChatHistory(userId: any, receiverId: string) {
    return ChatRepository.getChatHistory(userId, receiverId);
  }
}

export default new ChatService();
