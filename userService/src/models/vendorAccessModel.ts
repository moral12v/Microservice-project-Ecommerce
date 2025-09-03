import { Schema, Document, model, Types } from 'mongoose';

interface ILoginInfo {
  device: string;
  ip: string;
  lastLogin: string;
}

export interface IVendorAccessToken extends Document {
  vendorId: Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  loginInfo: ILoginInfo;
  isActive: boolean;
  createdAt: Date;
}

const loginInfoSchema = new Schema<ILoginInfo>({
  device: {
    type: String,
    index: true,
    required: true,
  },
  ip: {
    type: String,
    index: true,
    required: true,
  },
  lastLogin: {
    type: String,
    index: true,
    required: true,
  },
});

const vendorAccessTokenSchema = new Schema<IVendorAccessToken>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    accessToken: {
      type: String,
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      index: true,
    },
    loginInfo: {
      type: loginInfoSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const VendorAccessToken = model<IVendorAccessToken>('VendorAccessToken', vendorAccessTokenSchema);
export default VendorAccessToken;
