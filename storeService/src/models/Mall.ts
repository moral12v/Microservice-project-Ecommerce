import mongoose, { Document, Schema } from "mongoose";

export interface MallDoc extends Document {
  mallName: string;
  mallAddress: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  mallImageUrl: string;
  description: string;
  isActive: boolean;
  imageUrlLarge: string;
}

const MallSchema: Schema<MallDoc> = new Schema(
  {
    mallName: { type: String, required: true },
    mallAddress: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    mallImageUrl: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    imageUrlLarge: { type: String, default: "" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
MallSchema.index({ location: "2dsphere" });
export default mongoose.model<MallDoc>("Mall", MallSchema);
