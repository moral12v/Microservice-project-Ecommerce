import mongoose, { Document, Schema, Types } from 'mongoose';

export interface WishListDoc extends Document {
  _id:string
  customerId: string;
  productId: Types.ObjectId;
}

const WishListSchema: Schema<WishListDoc> = new Schema(
  {
    customerId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'MerchantProduct', required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<WishListDoc>('WishList', WishListSchema);
