import { Types } from "mongoose";

export interface CreateProductCategoryMetaDataDTO {
    categoryName: string;
    merchantId: string;
    products: Types.ObjectId
}

export interface UpdateProductCategoryMetaDataDTOO{
    categoryName: string;
    merchantId: string;
    products: Types.ObjectId
}