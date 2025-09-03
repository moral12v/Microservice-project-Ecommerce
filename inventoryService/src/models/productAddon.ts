import mongoose, { Document, Schema } from "mongoose";

export interface ProductAddonDoc extends Document {
  productId: string;
  categoryId: string;
  addonId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const ProductAddonSchema: Schema<ProductAddonDoc> = new Schema(
  {
    productId: { type: String, required: false , ref:"MerchantProduct"},
    categoryId: { type: String, required: false, ref:"Category" },
    addonId: { type: String, required: false, ref:"Addon" },
    createdAt: { type: Date, default: Date.now, required: false },
    updatedAt: { type: Date, default: Date.now, required: false },
    deletedAt: { type: Date, required: false }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

export default mongoose.model<ProductAddonDoc>("ProductAddon", ProductAddonSchema);
