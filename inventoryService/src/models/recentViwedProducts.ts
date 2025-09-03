
import mongoose, { Document, Schema } from 'mongoose';
import { ProductDoc } from './product'; 

export interface RecentViewedProductsDoc extends Document {
  customerId: string;
  products: ProductDoc['_id'][]; 
}

const RecentViewedProductsSchema: Schema<RecentViewedProductsDoc> = new Schema(
  {
    customerId: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<RecentViewedProductsDoc>('RecentViewedProducts', RecentViewedProductsSchema);
