import mongoose, { Document, Schema, Types } from "mongoose";

export interface ProductCategoryMetaDataDoc extends Document {
  categoryName: string;
  merchantId: string;
  products: Types.ObjectId[];
  
 
}

const ProductCategoryMetaDataSchema: Schema<ProductCategoryMetaDataDoc> = new Schema(
  {
    categoryName: { type: String },
    merchantId: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "MerchantProduct", index: true }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<ProductCategoryMetaDataDoc>("ProductCategoryMetaData", ProductCategoryMetaDataSchema);
