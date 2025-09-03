import mongoose, { Document, Schema } from 'mongoose';

export enum ApprovalStatus {
  Pending = 'pending',
  Completed = 'completed',
  Rejected = 'rejected',
}

export interface VendorDoc extends Document {
  _id: string;
  verified: boolean;
  approved: ApprovalStatus;
  activeStatus: boolean;
  fullName: string;
  firstName: string;
  lastName: string;
  mobile: string;
  dob: Date;
  gender: string;
  password: string;
  camparePassword: string;
  language: string;
  alternativeMobile: string;
  email: string;
  add1: string;
  add2: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark: string;
  identityProofName: string;
  identityProofFileUrl: string;
  accountHolderName: string;
  accountNumber: string; 
  bankName: string;
  branch: string;
  IFSCNumber: string;
  cancelledChequeUrl: string;
  accessToken: string;
  refreshToken: string;
  deviceToken: string;
  deletedAt: Date;
  otp?: string;
  otpExpires?: Date;
  isDeleted: boolean;
  resetToken?: string;
  resetTokenExpires?: Date;
}

const VendorSchema: Schema<VendorDoc> = new Schema(
  {
    verified: { type: Boolean, default: false },
    approved: { type: String, enum: Object.values(ApprovalStatus), default: ApprovalStatus.Pending },
    activeStatus: { type: Boolean, default: true },
    fullName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    dob: { type: Date },
    gender: { type: String },
    password: { type: String },
    camparePassword: { type: String },
    language: { type: String },
    alternativeMobile: { type: String },
    email: { type: String },
    add1: { type: String },
    add2: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    landmark: { type: String },
    identityProofName: { type: String },
    identityProofFileUrl: { type: String },
    accountHolderName: { type: String },
    accountNumber: { type: String }, 
    bankName: { type: String },
    branch: { type: String },
    IFSCNumber: { type: String }, 
    cancelledChequeUrl: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    deviceToken: { type: String },
    deletedAt: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },
    isDeleted: { type: Boolean, default: false },
    resetToken:{type: String},
    resetTokenExpires:{type: Date}
  },

  
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<VendorDoc>('Vendor', VendorSchema);
