import { Types } from "mongoose";

export interface CreateMerchantProductDTO {
  aggregatorProductId: string;
  merchantId: string;
  mallId: string;
  categoryId: string;
  subCategoryId: any[];
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
  exchangePolicy?: string;
  isCancellation: boolean;
  cancellationPolicy?: string;
  deliveryFee?: number;
  productImageUrl: string;
  hasTime?: boolean;
  startTime?: string;
  endTime?: string;
  variants?: VariantDTO[];
  isAddon:boolean;
  isActive: boolean; 
}

export interface UpdateMerchantProductDTO {
  aggregatorProductId?: string;
  merchantId?: string;
  mallId: string;
  categoryId?: string;
  subCategoryId: any[];
  productTitle?: string;
  productDescription?: string;
  packingCharge?: number;
  stock?: number;
  sellingPrice?: number;
  actualPrice?: number;
  gst?: number;
  freeDelivery?: boolean;
  foodType?: string;
  weight?: number;
  isExchange?: boolean;
  exchangePolicy?: string;
  isCancellation?: boolean;
  cancellationPolicy?: string;
  deliveryFee?: number;
  productImageUrl?: string;
  hasTime?: boolean;
  startTime?: string;
  endTime?: string;
  variants?: VariantDTO[];
  isAddon:boolean
  isActive: boolean;
}



export interface VariantDTO {
  attributeId: Types.ObjectId;  
  value: string;                
  stock: number;                
  sellingPrice: number;        
  actualPrice: number;         
  gst: number;                  
  productImages: string[];      
  description?: string;        
}