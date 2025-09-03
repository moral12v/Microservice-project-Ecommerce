import mongoose, { Document, Schema, Types } from "mongoose";
import { DeliveryTypeDoc } from "./deliveryType";

export interface StoreTimingSlot {
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
}

export interface StoreTiming {
  day: string;
  slots: StoreTimingSlot[];
}

export interface SubCategory {
  _id: string;
  count: number;
  name: string;
  imageUrl: string;
  categoryId: Object;
  isActive: boolean;
  description: string;
  imageUrlLarge: string;
}

export interface StoreDoc extends Document {
  _id: string;
  name: string;
  gstNumber: string;
  fssaiNumber?: string;
  mobile: string;
  altMobile?: string;
  password: string;
  email: string;
  add1: string;
  add2?: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  mallId: string;
  aggregatorId: Types.ObjectId;
  serviceRadius: number;
  services: string;
  storeImageUrl?: string;
  gstFileUrl?: string;
  fssaiFileUrl?: string;
  convFee: number;
  packingCharges: number;
  typeMarketPlace: string;
  isOpen: boolean;
  scheduledOrder: boolean;
  freeDelivery: boolean;
  negotiation: boolean;
  freeDeliveryIfMore?: number;
  exchange: boolean;
  policies?: string;
  productType: [];
  serviceType: [];
  MarketPalceType: string;
  deliveryTypes: DeliveryTypeDoc[];
  isNegotitation: boolean;
  gstfileUrl: string;
  fssaifileUrl: string;
  isActive?: boolean;
  approved?: "pending" | "approved" | "rejected";
  imgUrl: string;
  timings: StoreTiming[];
  subCategory: SubCategory[];
  deviceToken: string;
  storeId: string;
}

enum WeekDay {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

const defaultTimings: StoreTiming[] = Object.values(WeekDay).map((day) => ({
  day,
  slots: [
    {
      openingTime: "09:00",
      closingTime: "15:00",
      isOpen: true,
    },
    {
      openingTime: "15:00",
      closingTime: "23:00",
      isOpen: true,
    },
  ],
}));

const StoreTimingSlotSchema: Schema<StoreTimingSlot> = new Schema({
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
});

const StoreTimingSchema: Schema<StoreTiming> = new Schema({
  day: { type: String, enum: Object.values(WeekDay), required: true },
  slots: { type: [StoreTimingSlotSchema], required: true },
});

const StoreSchema: Schema<StoreDoc> = new Schema(
  {
    mallId: { type: String },
    aggregatorId: { type: Schema.Types.ObjectId },
    name: { type: String },
    gstNumber: { type: String },
    fssaiNumber: { type: String },
    mobile: { type: String },
    altMobile: { type: String },
    password: { type: String },
    email: { type: String },
    add1: { type: String },
    add2: { type: String },
    area: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    serviceRadius: { type: Number },
    services: { type: String },
    storeImageUrl: { type: String },
    gstFileUrl: { type: String },
    fssaiFileUrl: { type: String },
    convFee: { type: Number },
    packingCharges: { type: Number },
    typeMarketPlace: { type: String },
    scheduledOrder: { type: Boolean, default: false },
    freeDelivery: { type: Boolean, default: false },
    negotiation: { type: Boolean, default: false },
    freeDeliveryIfMore: { type: Number },
    exchange: { type: Boolean, default: false },
    policies: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    productType: { type: [] },
    serviceType: { type: [] },
    MarketPalceType: { type: String },
    deliveryTypes: [{ type: Schema.Types.ObjectId, ref: "DeliveryType" }],
    isNegotitation: { type: Boolean },
    gstfileUrl: { type: String },
    fssaifileUrl: { type: String },
    imgUrl: { type: String },
    deviceToken: { type: String },
    approved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    timings: {
      type: [StoreTimingSchema],
      default: defaultTimings,
      index: true,
    },
    subCategory: { type: [], index: true },
    storeId: { type: String, index: true },
  },
  {
    timestamps: true,
  }
);

StoreSchema.index({ location: "2dsphere" });
export default mongoose.model<StoreDoc>("store", StoreSchema);
