import { Types } from "mongoose";
import AddonMetaData, { AddonMetaDataDoc } from "../models/addonMetaData";

export class AddonMetaDataRepository {
  async createAddon(
    addonData: Partial<AddonMetaDataDoc>
  ): Promise<AddonMetaDataDoc> {
    const addon = new AddonMetaData(addonData);
    return await addon.save();
  }

  async updateAddon(
    addonId: string,
    updateData: Partial<AddonMetaDataDoc>
  ): Promise<AddonMetaDataDoc | null> {
    return await AddonMetaData.findByIdAndUpdate(addonId, updateData, {
      new: true,
    }).exec();
  }

  async deleteAddon(addonId: string): Promise<AddonMetaDataDoc | null> {
    return await AddonMetaData.findByIdAndDelete(addonId).exec();
  }

  async getAllAddon(merchantId: string): Promise<AddonMetaDataDoc[]> {
    const query: any = {};
    if (merchantId) {
      query.merchantId = new Types.ObjectId(merchantId);
    }
    return await AddonMetaData.find(query).exec();
  }

  async getAllAddonsById(addonId: string): Promise<AddonMetaDataDoc | null> {
    return await AddonMetaData.findById(addonId).exec();
  }
}

export const addonMetaDataRepository = new AddonMetaDataRepository();
