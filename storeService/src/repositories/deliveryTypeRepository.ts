import { Types } from "mongoose";
import DeliveryType,{DeliveryTypeDoc} from "../models/deliveryType";

export class DeliveryTypeRepository {
  async createDeliveryType(deliveryTypeData: Partial<DeliveryTypeDoc>): Promise<DeliveryTypeDoc> {
    const deliveryType = new DeliveryType(deliveryTypeData);
    return await deliveryType.save();
  }
  
  async getDeliveryTypeById(deliveryTypeId: string): Promise<DeliveryTypeDoc | null> {
    return await DeliveryType.findById(new Types.ObjectId(deliveryTypeId)).exec();
  }

  async updateDeliveryType(deliveryTypeId: string, updateData: Partial<DeliveryTypeDoc>): Promise<DeliveryTypeDoc | null> {
    return await DeliveryType.findByIdAndUpdate(deliveryTypeId, updateData, { new: true }).exec();
  }

//   async deleteCategoryAttribute(attributeId: string): Promise<CategoryAttributesDoc | null> {
//     return await CategoryAttributes.findByIdAndDelete(attributeId).exec();
//   }

  async getAllDeliveryType(): Promise<DeliveryTypeDoc[]> {
    return await DeliveryType.find().exec();
  }

//   async getCategoryAttributesByCategoryId(categoryId: string): Promise<CategoryAttributesDoc[]> {
//     return await CategoryAttributes.find({ categoryId }).exec();
//   }
}

export const deliveryTypeRepository = new DeliveryTypeRepository();
