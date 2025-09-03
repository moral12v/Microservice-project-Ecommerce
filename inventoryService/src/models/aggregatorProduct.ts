import mongoose, { Document, Schema, Types } from "mongoose";

enum ApprovalStatus {
  Pending = "pending",
  Completed = "completed",
  Rejected = "rejected",
}


export interface AggregatorProductDoc extends Document {
  aggregatorId: string;
  approved: ApprovalStatus;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId[];
  packingCharge: number;
  productTitle: string;
  productDescription: string;
  stock: number;
  sellingPrice: number;
  actualPrice: number;
  gst: number;
  freeDelivery: boolean;
  deliveryFee: number;
  foodType?: string;
  weigth?: number;
  productImageUrl: string;
  isExchange: boolean;
  exchangePolicy: string;
  isCancellation: boolean;
  cancellationPolicy: string;
  isActive: boolean,
}

const AggregatorProductSchema: Schema<AggregatorProductDoc> = new Schema(
  {
    approved: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.Pending,
    },
    aggregatorId: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategoryId: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
    productTitle: { type: String, required: true },
    productDescription: { type: String, required: true },
    stock: { type: Number, default: 0 },
    foodType:{type: String},
    sellingPrice: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    packingCharge: { type: Number, default: 0 },
    freeDelivery: { type: Boolean, default: false },
    deliveryFee: { type: Number, default: 0 },
    weigth: { type: Number, default: 0.5 },
    productImageUrl: { type: String },
    isExchange: { type: Boolean, default: false },
    exchangePolicy: { type: String, default: "" },
    isCancellation: { type: Boolean, default: false },
    cancellationPolicy: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
   

  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<AggregatorProductDoc>(
  "AggregatorProduct",
  AggregatorProductSchema
);
