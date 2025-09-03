import mongoose, { Document, Schema } from "mongoose";

export interface DeliveryChargesDoc extends Document {
  merchantId: string;
  name: string;
  price: number;
  time: string;
}

const DeliveryChargesSchema: Schema<DeliveryChargesDoc> = new Schema(
  {
    merchantId: { type: String },
    name: { type: String },
    price: { type: Number },
    time: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<DeliveryChargesDoc>(
  "DeliveryCharges",
  DeliveryChargesSchema
);
