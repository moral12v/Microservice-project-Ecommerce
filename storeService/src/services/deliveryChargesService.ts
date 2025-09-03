import {
  CreateDeliveryCharges,
  UpdateDeliveryCharges,
} from "../dtos/deliveryChargesDTO";
import { DeliveryChargesDoc } from "../models/deliveryCharges";
import { deliveryChargesRepsoitory } from "../repositories/deliveryChargesRepository";

class DeliveryChargesService {
  async getAllDeliveryCharges(
    merchantId: string
  ): Promise<DeliveryChargesDoc[]> {
    return await deliveryChargesRepsoitory.getAllDeliveryCharges(merchantId);
  }

  async updateDeliveryCharges(
    id: string,
    updateData: UpdateDeliveryCharges
  ): Promise<DeliveryChargesDoc | null> {
    return await deliveryChargesRepsoitory.updateById(id, updateData);
  }
}
export const deliveryChargesServices = new DeliveryChargesService();
