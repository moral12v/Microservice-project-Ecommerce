import mongoose, { Document, Schema, Types } from 'mongoose';

export interface vendorCouponsDoc extends Document {
    code: string; 
    description: string;
    productId: string;
    categoryId: string;
    userId: string;
    used: boolean;
    status: boolean;
    discount: number;
    totalAmount: number;
    finalAmount: number;
    maxDiscount: number;
    usedCount: number;
    validTill: Date;
    usePerUser: number;
    vendorId: string;
    activeInactive: boolean;
}

const vendorCouponsSchema: Schema<vendorCouponsDoc> = new Schema(
    {
        code: { type: String, unique: true, required: true }, 
        description: { type: String },
        productId: { type: String, required: true },
        categoryId: { type: String, required: true },
        userId: { type: String, required: true },
        used: { type: Boolean, default: false },
        status: { type: Boolean, default: true },
        discount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        finalAmount: { type: Number, required: true },
        maxDiscount: { type: Number, required: true },
        usedCount: { type: Number, default: 0 },
        validTill: { type: Date, required: true },
        usePerUser: { type: Number, default: 1 },
        vendorId: { type:String, required: true },
        activeInactive: { type: Boolean, default: true }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<vendorCouponsDoc>('vendorCoupons', vendorCouponsSchema);
