import { Types } from "mongoose";


enum ApprovalStatus {
  Pending = "pending",
  Completed = "completed",
  Rejected = "rejected",
}


export interface CreateAggregatorProductDTO {
  approved?: ApprovalStatus;
  aggregatorId: string;
  categoryId?: Types.ObjectId;
  subCategoryId?: Types.ObjectId[];
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
  weight?: number;
  productImageUrl: string;
  isExchange: boolean;
  exchangePolicy: string;
  isCancellation: boolean;
  cancellationPolicy: string;
  isActive: boolean;
}

export interface UpdateAggregatorProductDTO {
  approved?: ApprovalStatus;
  aggregatorId?: string;
  categoryId?: Types.ObjectId;
  subCategoryId?: Types.ObjectId[];
  packingCharge?: number;
  productTitle?: string;
  productDescription?: string;
  stock?: number;
  sellingPrice?: number;
  actualPrice?: number;
  gst?: number;
  freeDelivery?: boolean;
  deliveryFee?: number;
  foodType?: string;
  weight?: number;
  productImageUrl?: string;
  isExchange?: boolean;
  exchangePolicy?: string;
  isCancellation?: boolean;
  cancellationPolicy?: string;
  isActive: boolean;
}
