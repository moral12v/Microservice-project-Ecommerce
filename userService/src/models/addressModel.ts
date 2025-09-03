import mongoose, { Document, Schema } from 'mongoose';

export interface AddressDoc extends Document {
  customerId: string;
  addType: string;
  add1: string;
  add2: string;
  city: string;
  state: string;
  country: string;
  area?: string;
  landmark?: string;
  fullName?: string;
  mobile?: string;
  lat?: number;
  lng?: number;
  zipcode: string;
}

const AddressSchema: Schema<AddressDoc> = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    addType: {
      type: String,
      required: true,
    },
    add1: {
      type: String,
      required: true,
    },
    add2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    area: {
      type: String,
    },
    landmark: {
      type: String,
    },
    fullName: {
      type: String,
    },
    mobile: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    zipcode: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model<AddressDoc>('Address', AddressSchema);
