import mongoose, { Document, Schema, Types } from "mongoose";

export interface UserDoc extends Document {
  name:string;
  socketId: string;
  userId: string;
  deviceId: string;
  userType: string;
}

const UserSchema: Schema<UserDoc> = new Schema(
  {
    name: {
      type: String,
    },
    socketId: {
      type: String,
    },
    userId: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    userType: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<UserDoc>("User", UserSchema);
