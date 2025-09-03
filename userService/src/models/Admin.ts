import mongoose, { Document, Schema } from 'mongoose';

export interface AdminDoc extends Document {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  super: boolean;
  accessToken: string;
  refreshToken: string;
  deletedAt: Date;
  otp?: string;
  isApproved: boolean;
  otpExpires?: Date;
  isDeleted: boolean;
}

const AdminSchema: Schema<AdminDoc> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    super: {
      type: Boolean,
      default: false,
      index: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isApproved: {
      type: Boolean,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model<AdminDoc>('Admin', AdminSchema);
