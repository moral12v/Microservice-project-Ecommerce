import mongoose, { Document, Schema } from 'mongoose';

export interface CustomerDoc extends Document {
  _id: string;
  fullName: string;
  mobile: string;
  email: string;
  dob: Date;
  language: string;
  accessToken: string;
  refreshToken: string;
  deviceToken: string;
  verified?: boolean;
  isActive: boolean;
  isdeleted: boolean;
  otp?: string;
  otpExpires?: Date;
  isRecentlyCreated: boolean;
}

const CustomerSchema: Schema<CustomerDoc> = new Schema(
  {
    fullName: {
      type: String,
      index: true,
    },
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      default:null,
      index:true
    },
    language: {
      type: String,
      default: 'en',
      index: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    deviceToken: {
      type: String,
    },
    verified: {
      type: Boolean,
      index: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      index: true,
      default: true,
    },
    isdeleted: {
      type: Boolean,
      index: true,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isRecentlyCreated: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model<CustomerDoc>('Customer', CustomerSchema);
