import mongoose, { Document, Schema } from "mongoose";

export interface SubcategoryDoc extends Document {
  _id: string;
  name: string;
  imageUrl: string;
  categoryId: Object;
  isActive: boolean;
  description: string;
  imageUrlLarge: string;
}

const SubcategorySchema: Schema<SubcategoryDoc> = new Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    description: { type: String, required: true },
    imageUrlLarge: { type: String ,default:''}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<SubcategoryDoc>("Subcategory", SubcategorySchema);
