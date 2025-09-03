import mongoose, { Document, Schema, Types } from "mongoose";

export enum ApprovalStatus {
  Pending = "pending",
  Completed = "completed",
  Rejected = "rejected",
}

export interface Variant {
  attributeId: Types.ObjectId;
  value: string;
  stock: number;
  sellingPrice: number;
  actualPrice: number;
  gst: number;
  productImages: string[];
  description?: string;
}

export interface MerchantProductDoc extends Document {
  price: any;
  aggregatorProductId: Types.ObjectId;
  merchantId: Types.ObjectId;
  mallId: string;
  approved: ApprovalStatus;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId[];
  productTitle: string;
  productDescription: string;
  packingCharge: number;
  stock: number;
  sellingPrice: number;
  actualPrice: number;
  gst: number;
  freeDelivery: boolean;
  foodType?: string;
  weight?: number;
  isExchange: boolean;
  exchangePolicy: string;
  isCancellation: boolean;
  cancellationPolicy: string;
  deliveryFee: number;
  deliveryType: Types.ObjectId[];
  productImageUrl: string;
  approvedByAdmin: ApprovalStatus;
  hasTime: boolean;
  startTime: string;
  endTime: string;
  variants?: Variant[];
  addOns: Types.ObjectId[];
  tags: Types.ObjectId[];
  isAddon: boolean;
  isActive: boolean;
}

const VariantSchema: Schema<Variant> = new Schema({
  attributeId: {
    type: Schema.Types.ObjectId,
    ref: "CategoryAttributes",
    required: true,
  },
  value: { type: String, required: true },
  stock: { type: Number, default: 0 },
  sellingPrice: { type: Number, required: true },
  actualPrice: { type: Number, required: true },
  gst: { type: Number, default: 0 },
  productImages: [{ type: String }],
  description: { type: String, default: "" },
});

const MerchantProductSchema: Schema<MerchantProductDoc> = new Schema(
  {
    approved: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.Pending,
      index: true,
    },
    aggregatorProductId: {
      type: Schema.Types.ObjectId,
      ref: "AggregatorProduct",
      index: true,
    },
    merchantId: { type: Schema.Types.ObjectId, required: true, index: true },
    mallId: { type: String, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategoryId: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
    productTitle: { type: String, required: true },
    productDescription: { type: String, required: true },
    packingCharge: { type: Number, required: true },
    stock: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    gst: { type: Number, required: true },
    freeDelivery: { type: Boolean, required: true },
    deliveryType: [{ type: Schema.Types.ObjectId, ref: "DeliveryType" }],
    foodType: { type: String },
    weight: { type: Number },
    isExchange: { type: Boolean, default: false },
    exchangePolicy: { type: String, default: "" },
    isCancellation: { type: Boolean, default: false },
    cancellationPolicy: { type: String, default: "" },
    deliveryFee: { type: Number, default: 0 },
    productImageUrl: { type: String },
    approvedByAdmin: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.Pending,
      index: true,
    },
    hasTime: { type: Boolean, default: false },
    startTime: { type: String, index: true },
    endTime: { type: String, index: true },
    variants: [VariantSchema],
    addOns: [{ type: Schema.Types.ObjectId, ref: "AddOnMetaData", index: true }],
    tags: [{ type: Schema.Types.ObjectId, ref: "ProductCategoryMetaData", index: true, default:[] }],
    isAddon: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<MerchantProductDoc>(
  "MerchantProduct",
  MerchantProductSchema
);
