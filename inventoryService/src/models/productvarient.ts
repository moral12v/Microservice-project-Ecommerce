import mongoose, { Document, Schema } from 'mongoose';

export interface ProductVarientDoc extends Document {
    _id: string;
    categoryId: string;
    productId: string;
    combinationName: string;
    stock : number;
    price: number;

}

const ProductVarientSchema: Schema<ProductVarientDoc> = new Schema(
    {
        _id: {type: String},
        categoryId: { type: String, },
        productId:{type: String},
        combinationName:{type: String},
        stock:{type: Number},
        price:{type: Number}
      },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<ProductVarientDoc>('Productvarient', ProductVarientSchema);
