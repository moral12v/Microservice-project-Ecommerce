import mongoose, { Document, Schema } from "mongoose";

export interface AddonDoc extends Document {
  name: string;
  price: number;
  gst: string;
  camparePrice: number;
  available: boolean;
  vendorId: string;
  approve: boolean
}

const AddonSchema: Schema<AddonDoc> = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    gst: { type: String },
    camparePrice: { type: Number },
    available: { type: Boolean },
    vendorId: { type: String },
    approve: { type: Boolean },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<AddonDoc>("Addon", AddonSchema);
