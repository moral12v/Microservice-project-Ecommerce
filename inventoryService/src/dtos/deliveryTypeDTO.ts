import { Types } from "mongoose";

export interface CreateDeliveryTypeDTO {
  name: string;
  isActive: boolean;
}
    
export interface UpdateDeliveryTypeDTO {
    name: string;
    isActive: boolean;
}
    
