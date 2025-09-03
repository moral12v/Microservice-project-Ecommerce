import mongoose, { Document, Schema, Types } from 'mongoose';

export interface CategoryAttributesDoc extends Document {

    categoryId:  Types.ObjectId;
    attributeName: string;
}

const CategoryAttributesSchema: Schema<CategoryAttributesDoc> = new Schema(
    {
        categoryId: { type: Schema.Types.ObjectId, index:true , ref:'Category'},
        attributeName:{type: String},       
      },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<CategoryAttributesDoc>('CategoryAttributes', CategoryAttributesSchema);
