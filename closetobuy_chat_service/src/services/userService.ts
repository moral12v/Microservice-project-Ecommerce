import UserRepository from "../repositories/userRepository";
import { UserDoc } from "../models/userModel";

class UserService {
  async createUser(
    socketId: string,
    userId: string,
    deviceId: string,
    userType: "merchant" | "admin" | "customer",
    name:string
  ): Promise<UserDoc> {
    return await UserRepository.createUser({
      socketId,
      userId,
      deviceId,
      userType,
      name
    });
  }

  async getUserById(userId: string): Promise<UserDoc | null> {
    return await UserRepository.findById(userId);
  }

  async getUserBySocketId(socketId: string): Promise<UserDoc | null> {
    return await UserRepository.findBySocketId(socketId);
  }

  async updateUser(
    userId: string,
    updateData: Partial<UserDoc>
  ): Promise<UserDoc | null> {
    return await UserRepository.updateUser(userId, updateData);
  }

  async deleteUser(userId: string): Promise<void> {
    await UserRepository.deleteUserById(userId);
  }

  async deleteUserBySocketId(socketId: string): Promise<void> {
    await UserRepository.deleteUserBySocketId(socketId);
  }
}

export default new UserService();
