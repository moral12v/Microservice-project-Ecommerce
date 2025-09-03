import { Types } from 'mongoose';
export interface CreateWishListDTO {
    customerId:string ;
    productId: Types.ObjectId;
    isWishList:boolean
}
    
export interface UpdateWishListDTO {
    customerId: string;
    productId: Types.ObjectId;
    isWishList:boolean
}
    