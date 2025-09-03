import Vendor, { VendorDoc } from '../models/Vendor';

export class BankRepository {
  async createBank(vendorData: Partial<VendorDoc>): Promise<VendorDoc> {
    const bank = new Vendor(vendorData);
    return await bank.save();
  }

  async updateBank(bankId: string, updateData: Partial<VendorDoc>): Promise<VendorDoc | null> {
    return await Vendor.findByIdAndUpdate(bankId, updateData, { new: true }).exec();
  }
}

export const bankRepository = new BankRepository();
