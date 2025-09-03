import { Types } from "mongoose";

export interface CreateVendorCouponsDTO {
    code: string;
    description: string;
    productId: string;
    categoryId: string;
    userId: string;
    discount: number;
    totalAmount: number;
    finalAmount: number;
    maxDiscount: number;
    validTill: Date;
    usePerUser?: number;
    vendorId: string;
    activeInactive?: boolean;
}
    

    
export interface UpdateVendorCouponsDTO {
    code?: string;
    description?: string;
    productId?: string;
    categoryId?: string;
    userId?: string;
    used?: boolean;
    status?: boolean;
    discount?: number;
    totalAmount?: number;
    finalAmount?: number;
    maxDiscount?: number;
    usedCount?: number;
    validTill?: Date;
    usePerUser?: number;
    vendorId?: string;
    activeInactive?: boolean;
}