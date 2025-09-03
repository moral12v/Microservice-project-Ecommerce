import mongoose, { Document, Schema } from "mongoose";

export interface DeliveryTypeDoc extends Document {
  name: string;
 isActive: boolean;
}

const DeliveryTypeSchema: Schema<DeliveryTypeDoc> = new Schema(
  {
    name: { type: String },
    isActive: { type: Boolean },
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<DeliveryTypeDoc>("DeliveryType", DeliveryTypeSchema);
