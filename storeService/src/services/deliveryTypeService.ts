

import { deliveryTypeRepository } from "../repositories/deliveryTypeRepository";
import { CreateDeliveryTypeDTO, UpdateDeliveryTypeDTO } from "../dtos/deliveryTypeDTO";
import { DeliveryTypeDoc } from "../models/deliveryType";

export const createDeliveryType = async (deliveryTypeDto: CreateDeliveryTypeDTO): Promise<DeliveryTypeDoc> => {
  return await deliveryTypeRepository.createDeliveryType(deliveryTypeDto);
};

export const getAllDeliveryType = async (): Promise<DeliveryTypeDoc[]> => {
  return await deliveryTypeRepository.getAllDeliveryType();
};

export const getDeliveryTypeById = async (deliveryTypeId: string): Promise<DeliveryTypeDoc | null> => {
  return await deliveryTypeRepository.getDeliveryTypeById(deliveryTypeId);
};

export const updateDeliveryType = async (deliveryTypeId: string, deliveryTypeDto: UpdateDeliveryTypeDTO): Promise<DeliveryTypeDoc | null> => {
  return await deliveryTypeRepository.updateDeliveryType(deliveryTypeId, deliveryTypeDto);
};

