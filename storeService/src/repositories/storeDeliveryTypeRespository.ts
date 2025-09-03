import StoreDeliveryType,{StoreDeliveryTypeDoc} from "../models/StoreDeliveryType";

export class StoreDeliveryTypeRepository {
  
  async createStoreDeliveryType(addressData: Partial<StoreDeliveryTypeDoc>): Promise<StoreDeliveryTypeDoc> {
    const storeDeliveryType = new StoreDeliveryType(addressData);
    return await storeDeliveryType.save();
  }

  async getAllStoreDeliveryType(): Promise<StoreDeliveryTypeDoc[]> {
    return await StoreDeliveryType.find({}).exec();
  }
  
  async getStoreDeliveryTypeById(storeDeliveryTypeId: string): Promise<StoreDeliveryTypeDoc | null> {
    return await StoreDeliveryType.findById(storeDeliveryTypeId).exec();
  }
  async updateStoreDeliveryType(storeDeliveryTypeId: string, updateData: Partial<StoreDeliveryTypeDoc>): Promise<StoreDeliveryTypeDoc | null> {
    return await StoreDeliveryType.findByIdAndUpdate(storeDeliveryTypeId, updateData, { new: true }).exec();
  }

  
  async deleteStoreDeliveryType(storeDeliveryTypeId: string): Promise<StoreDeliveryTypeDoc | null> {
    return await StoreDeliveryType.findByIdAndDelete(storeDeliveryTypeId).exec();
  }
}

export const storeDeliveryTypeRepository = new StoreDeliveryTypeRepository();


