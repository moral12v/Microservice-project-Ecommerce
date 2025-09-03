import mongoose, { Document, Schema } from 'mongoose';

export interface ServiceDoc extends Document {

  name: string;
  isActive: boolean;
  imageUrl: string;
  perMonthPrice: number;
  perDayPrice: number;
}
const serviceSchema: Schema<ServiceDoc> = new Schema(
  {
    name: {type: String},
    isActive: { type: Boolean, },
    imageUrl:{type: String},
    perMonthPrice: {type: Number},
    perDayPrice: {type: Number}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<ServiceDoc>('Service', serviceSchema);
