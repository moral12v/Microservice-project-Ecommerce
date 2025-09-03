import mongoose, { Document, Schema } from "mongoose";

export interface CategoryDoc extends Document {
  _id: string;
  name: string;
  isActive: boolean;
  imageUrl: string;
  activeIcon: string;
  disabledIcon: string;
  imageUrlLarge: string;
}

const CategorySchema: Schema<CategoryDoc> = new Schema(
  {
    name: { type: String, required: true, index: true },
    isActive: { type: Boolean },
    imageUrl: { type: String },
    activeIcon: { type: String, default:'' },
    disabledIcon: { type: String ,default:'' },
    imageUrlLarge: { type: String ,default:''}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<CategoryDoc>("Category", CategorySchema);
