
import { Types } from "mongoose";

enum couponType {
  aggregator = "AGGREGATOR",
  merchant = "MERCHANT",
  admin = "ADMIN",
}

export interface CreateCouponsDTO {
  code: string;
  description: string;
  discount: number;
  maxAmount: number;
  maxDiscount: number;
  expireDate: Date;
  maxUsePerUser: number;
  aggregatorId?: string;  
  merchantId?: string;    
  noOfCoupon: number;
  isActive: boolean;
  type: 'flat' | 'percentage';
  product?: Types.ObjectId[];  
  customer?: Types.ObjectId[]; 
  category?: Types.ObjectId;  
}


export interface UpdateCouponsDTO {
  code: string;
  description: string;
  discount: number;
  maxAmount: number;
  maxDiscount: number;
  expireDate: Date;
  maxUsePerUser: number;
  aggregatorId?: string; 
  merchantId?: string;  
  noOfCoupon: number;
  isActive: boolean;
  type: 'flat' | 'percentage';
  product?: Types.ObjectId[];  
  customer?: Types.ObjectId[]; 
  category?: Types.ObjectId; 
}
