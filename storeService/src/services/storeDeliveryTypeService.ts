import { StoreDeliveryTypeDoc } from '../models/StoreDeliveryType';
import { storeDeliveryTypeRepository } from '../repositories/storeDeliveryTypeRespository';
import { CreateStoreDeliveryTypeDTO } from '../dtos/Store-Delivery-TypeDTO';


export const getAllStoreDeliveryType = async (): Promise<StoreDeliveryTypeDoc[] | null> => {
  const data = await storeDeliveryTypeRepository.getAllStoreDeliveryType();
  return data ? data : [];
};

export const getStoreDeliveryTypeById = async (storeId: string): Promise<StoreDeliveryTypeDoc | null> => {
  return await storeDeliveryTypeRepository.getStoreDeliveryTypeById(storeId);
 
};


export const createStoreDeliveryType = async (data: StoreDeliveryTypeDoc): Promise<StoreDeliveryTypeDoc> => {
  return await storeDeliveryTypeRepository.createStoreDeliveryType(data);
};

export const updateStoreDeliveryType = async (storeId: string, updateData: Partial<StoreDeliveryTypeDoc>): Promise<StoreDeliveryTypeDoc | null> => {
  return await storeDeliveryTypeRepository.updateStoreDeliveryType(storeId, updateData);
};

export const deleteStoreDeliveryType = async (storeId: string): Promise<StoreDeliveryTypeDoc | null> => {
  return await storeDeliveryTypeRepository.deleteStoreDeliveryType(storeId);
};
