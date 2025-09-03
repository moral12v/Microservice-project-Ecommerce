import mongoose, { Schema, Document, Model } from "mongoose";

export interface ChatDoc extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

export interface ChatModel extends Model<ChatDoc> {
  getChatList(userId: string): Promise<ChatDoc[]>;
  getLastMessage(senderId: string, receiverId: string): Promise<ChatDoc | null>;
}

const ChatSchema = new Schema<ChatDoc>({
  senderId: { type: String},
  receiverId: { type: String},
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

ChatSchema.statics.getChatList = async function (userId: string): Promise<any[]> {
  return this.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
    },
    {
      $sort: { timestamp: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", userId] },
            "$receiverId",
            "$senderId",
          ],
        },
        lastMessage: { $first: "$$ROOT" }, 
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "userId", 
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 1,
        lastMessage: 1,
        "userDetails.name": 1,
      },
    },
  ]);
};


ChatSchema.statics.getLastMessage = async function (senderId: string, receiverId: string): Promise<ChatDoc | null> {
  return this.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  }).sort({ timestamp: -1 });
};

const Chat = mongoose.model<ChatDoc, ChatModel>("Chat", ChatSchema);

export default Chat;
