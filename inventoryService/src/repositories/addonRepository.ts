import Addon, { AddonDoc } from "../models/addon";

export class AddonRepository {
  async createAddon(addonData: Partial<AddonDoc>): Promise<AddonDoc> {
    const addon = new Addon(addonData);
    return await addon.save();
  }
  
  async getAddonById(addonId: string): Promise<AddonDoc | null> {
    return await Addon.findById(addonId).exec();
  }

  async updateAddon(addonId: string, updateData: Partial<AddonDoc>): Promise<AddonDoc | null> {
    return await Addon.findByIdAndUpdate(addonId, updateData, { new: true }).exec();
  }

  async deleteAddon(addonId: string): Promise<AddonDoc | null> {
    return await Addon.findByIdAndDelete(addonId).exec();
  }

  async getAllAddons(available?: boolean, approve?: boolean): Promise<AddonDoc[]> {
    const query: any = {};
    
    if (available !== undefined) {
      query.available = available;
    }
    
    if (approve !== undefined) {
      query.approve = approve;
    }

    return await Addon.find(query).exec();
  }
}


export const addonRepository = new AddonRepository();
