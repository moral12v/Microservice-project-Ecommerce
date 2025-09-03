import mongoose, { Document, Schema } from 'mongoose';
import category from './category';

export interface ProductDoc extends Document {

  merchants: string;
  category: string;
  subCategory: string;
  packingCharge: number;
  productTitle: string; 
  productDescription: string;
  stock: number;
  sellingPrice: number;
  actualPrice: number;
  gst: number;
  freeDelivery: boolean;
  categoryId: string; 
  foodType?: string; 
  weigth?: number; 
  productImageUrl: string;
  approvedByAdmin?: boolean;
  exchangePolicy: string;
  cancellationPolicy: string;
  
}

const ProductSchema: Schema<ProductDoc> = new Schema(
  {
    merchants:{type: String},
    category:{type: String},
    subCategory:{type: String},
    packingCharge:{type: Number},
    productTitle:{type: String},
    productDescription:{type: String},
    stock:{type: Number},
    sellingPrice:{type: Number},
    actualPrice:{type: Number},
    gst: { type: Number },
    freeDelivery: {type: Boolean},
    categoryId: { type:String }, 
    weigth:{type: Number},
    productImageUrl:{type: String},
    exchangePolicy:{type: String},
    cancellationPolicy:{type: String},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<ProductDoc>('Product', ProductSchema);
