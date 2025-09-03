import { Types } from "mongoose";

export interface CreateCategoryAttributesDTO {
    categoryId: Types.ObjectId;
    attributeName: string;
    
}
    
    export interface UpdateCategoryAttributesDTO {
    categoryId?: Types.ObjectId;
    attributeName?: string;
   
}
    