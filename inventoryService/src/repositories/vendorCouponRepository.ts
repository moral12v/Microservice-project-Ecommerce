import VendorCoupon,{vendorCouponsDoc} from "../models/vendorCoupon";

export class VendorCouponRepository {
  async createVendorCoupon(couponData: Partial<vendorCouponsDoc>): Promise<vendorCouponsDoc> {
    const vendorCoupon = new VendorCoupon(couponData);
    return await vendorCoupon.save();
  }

  async updateVendorCoupon(couponId: string, updateData: Partial<vendorCouponsDoc>): Promise<vendorCouponsDoc | null> {
    return await VendorCoupon.findByIdAndUpdate(couponId, updateData, { new: true }).exec();
  }

  async deleteVendorCoupon(couponId: string): Promise<vendorCouponsDoc | null> {
    return await VendorCoupon.findByIdAndDelete(couponId).exec();
  }

  async getAllVendorCoupons(): Promise<vendorCouponsDoc[]> {
    return await VendorCoupon.find().exec();
  }

  async activateVendorCoupon(couponId: string): Promise<vendorCouponsDoc | null> {
    return await VendorCoupon.findByIdAndUpdate(couponId, { activeInactive: true }, { new: true }).exec();
  }

  async deactivateVendorCoupon(couponId: string): Promise<vendorCouponsDoc | null> {
    return await VendorCoupon.findByIdAndUpdate(couponId, { activeInactive: false }, { new: true }).exec();
  }
}

export const vendorCouponRepository = new VendorCouponRepository();
