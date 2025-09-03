import mongoose, { Document, Schema, Types } from 'mongoose';

enum couponType {
  aggregator = "Aggregator",
  merchant = "Merchant",
  admin = "Admin",
}

export interface CouponsDoc extends Document {
  code: string;
  coupon: couponType;
  description: string;
  discount: number;
  maxAmount: number;
  maxDiscount: number;
  expireDate: Date;
  maxUsePerUser: number;
  aggregatorId?: string;  
  merchantId?: string;  
  noOfCoupon: number;
  isActive: boolean;
  type: 'flat' | 'percentage'; 
  product: Types.ObjectId[];  
  customer: Types.ObjectId[]; 
  category: mongoose.Types.ObjectId;
}

const CouponsSchema: Schema<CouponsDoc> = new Schema(
  {
    coupon: {
      type: String,
      enum: Object.values(couponType),
    },
    code: { type: String, required: true },
    description: { type: String },
    discount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    maxDiscount: { type: Number },
    expireDate: { type: Date, required: true },
    maxUsePerUser: { type: Number, required: true },
    noOfCoupon: { type: Number, required: true },
    aggregatorId: { type: String },
    merchantId: { type: String },
    isActive: { type: Boolean, default: true },
    product: [{ type: Types.ObjectId, ref: 'MerchantProduct' }],  
    customer: [{ type: Types.ObjectId, ref: 'Customer' }],  
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    type: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<CouponsDoc>('Coupon', CouponsSchema);
