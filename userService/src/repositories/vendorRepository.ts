import mongoose from 'mongoose';
import Vendor, { VendorDoc } from '../models/Vendor';
import { UpdateVendorPersonalDetailsDTO } from '../dtos/VendorDTO';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { randomBytes } from 'crypto';

export class VendorRepository {
  async createVendor(vendorData: Partial<VendorDoc>): Promise<VendorDoc> {
    const vendor = new Vendor(vendorData);
    return await vendor.save();
  }

  async getVendorById(vendorId: string): Promise<VendorDoc | null> {
    return await Vendor.findOne({ _id: vendorId, isDeleted: false }).exec();
  }

  async updateVendor(vendorId: string, updateData: Partial<VendorDoc>): Promise<VendorDoc | null> {
    return await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true }).exec();
  }

  async getAllVendor(): Promise<VendorDoc[]> {
    return await Vendor.find({ isDeleted: false }).exec();
  }
  async findByMobile(mobile: string): Promise<VendorDoc | null> {
    const vendor = await Vendor.findOne({ mobile, isDeleted: false }).exec();
    return vendor;
  }

  async deleteVendor(vendorId: string): Promise<VendorDoc | null> {
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    ).exec();
    return vendor;
  }

  async updateVendorPersonalDetails(vendorId: string, updateDto: UpdateVendorPersonalDetailsDTO) {
    return await Vendor.findByIdAndUpdate(vendorId, updateDto, { new: true });
  }

  async updateVendorAddress(vendorId: string, updateDto: UpdateVendorPersonalDetailsDTO) {
    return await Vendor.findByIdAndUpdate(
      vendorId,
      {
        $set: updateDto,
      },
      { new: true },
    );
  }

  async createBank(vendorId: string, vendorData: Partial<VendorDoc>): Promise<VendorDoc> {
    const updatedVendor = await Vendor.findOneAndUpdate({ _id: vendorId }, { $set: vendorData }, { new: true });
    if (!updatedVendor) {
      throw new Error(`Vendor with ID '${vendorId}' not found.`);
    }

    return updatedVendor;
  }

  async getVendorsWithPagination(
    page: number,
    limit: number,
    approvalStatus: string,
    isPagination: string,
  ): Promise<{
    vendors: VendorDoc[];
    total: number;
  }> {
    const query: any = {};
    if (approvalStatus) {
      query.approved = approvalStatus;
    }
    query.isDeleted = false;
    if (isPagination == 'false') {
      const vendors = await Vendor.find(query).exec();
      return {
        vendors,
        total: vendors.length,
      };
    } else {
      const vendors = await Vendor.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await Vendor.countDocuments(query).exec();
      return {
        vendors,
        total,
      };
    }
  }

  async approveVendor(vendorId: string): Promise<VendorDoc | null> {
    return await Vendor.findByIdAndUpdate(
      vendorId,
      {
        approved: 'completed',
      },
      { new: true },
    ).exec();
  }

  async rejectVendor(vendorId: string): Promise<VendorDoc | null> {
    return await Vendor.findByIdAndUpdate(
      vendorId,
      {
        approved: 'rejected',
      },
      { new: true },
    ).exec();
  }

  async changePassword(vendorId: string, newPassword: string): Promise<VendorDoc | null> {
    const vendor = await Vendor.findById(vendorId).exec();
    if (!vendor) {
      throw new Error(`Vendor with ID '${vendorId}' not found.`);
    }
    const isMatch = await this.findByMobile(newPassword);

    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    const hashedPassword = await hashPassword(newPassword);
    vendor.password = hashedPassword;

    return await vendor.save();
  }

  async generateResetToken(vendorId: string): Promise<VendorDoc | null> {
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    const vendor = await Vendor.findByIdAndUpdate(vendorId, { resetToken, resetTokenExpires }, { new: true }).exec();

    if (!vendor) {
      throw new Error(`Vendor with ID '${vendorId}' not found.`);
    }

    return vendor;
  }

  async verifyResetToken(vendorId: string, resetToken: string): Promise<VendorDoc | null> {
    return await Vendor.findOne({
      _id: vendorId,
      resetToken,
      resetTokenExpires: { $gt: new Date() },
    }).exec();
  }

  async resetPassword(vendorId: string, resetToken: string, newPassword: string): Promise<VendorDoc | null> {
    const vendor = await Vendor.findOne({
      _id: vendorId,
      resetToken,
      resetTokenExpires: { $gt: new Date() },
    }).exec();

    if (!vendor) {
      throw new Error('Invalid or expired reset token.');
    }

    const hashedPassword = await hashPassword(newPassword);
    vendor.password = hashedPassword;
    vendor.resetToken = undefined;
    vendor.resetTokenExpires = undefined;

    return await vendor.save();
  }
}

export const vendorRepository = new VendorRepository();
