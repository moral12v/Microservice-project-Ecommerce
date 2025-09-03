import { Model } from "mongoose";
import User, { UserDoc } from "../models/userModel";

class UserRepository {
  private userModel: Model<UserDoc>;

  constructor() {
    this.userModel = User;
  }

  async createUser(data: {
    socketId: string;
    userId: string;
    deviceId: string;
    userType: "merchant" | "admin" | "customer";
    name: string;
  }): Promise<UserDoc> {
    return await this.userModel.create(data);
  }

  async findById(userId: string): Promise<UserDoc | null> {
    return await this.userModel.findOne({ userId }).exec();
  }

  async findBySocketId(socketId: string): Promise<UserDoc | null> {
    return await this.userModel.findOne({ socketId }).exec();
  }

  async updateUser(
    userId: string,
    updateData: Partial<UserDoc>
  ): Promise<UserDoc | null> {
    return await this.userModel
      .findOneAndUpdate({ userId }, updateData, { new: true })
      .exec();
  }

  async deleteUserById(userId: string): Promise<void> {
    await this.userModel.findOneAndDelete({ userId }).exec();
  }

  async deleteUserBySocketId(socketId: string): Promise<void> {
    await this.userModel.findOneAndDelete({ socketId }).exec();
  }
}

export default new UserRepository();
