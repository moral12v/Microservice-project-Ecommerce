import DeliveryCharges, { DeliveryChargesDoc } from "../models/deliveryCharges";
import {
  CreateDeliveryCharges,
  UpdateDeliveryCharges,
} from "../dtos/deliveryChargesDTO";

export class DeliveryChargesRespository {
 async createMany(deliveryChargesData:any): Promise<any> {
    return await DeliveryCharges.insertMany(deliveryChargesData);
  }

  async getAllDeliveryCharges(merchantId:string): Promise<DeliveryChargesDoc[]> {
    return await DeliveryCharges.find({merchantId}).exec();
  }

  async updateById(
    id: string,
    updateData: Partial<DeliveryChargesDoc>
  ): Promise<DeliveryChargesDoc | null> {
    return await DeliveryCharges.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteByStoreId(storeId: string): Promise<void> {
    await DeliveryCharges.deleteMany({ merchantId: storeId }).exec();
  }
}

export const deliveryChargesRepsoitory = new DeliveryChargesRespository();
