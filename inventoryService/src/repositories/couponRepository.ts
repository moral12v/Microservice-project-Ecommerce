import mongoose from "mongoose";
import Coupon, { CouponsDoc } from "../models/coupons";

export class CouponRepository {
  async createCoupon(couponData: Partial<CouponsDoc>): Promise<CouponsDoc> {
    const coupon = new Coupon(couponData);
    return await coupon.save();
  }

  async getAllCoupons(
    page: number,
    limit: number,
    merchantId: string,
    isPagination: string,
    activeStatus: string
  ): Promise<{ coupons: CouponsDoc[]; total: number }> {
    const query: any = {};
    if (merchantId) {
      query.merchantId = new mongoose.Types.ObjectId(merchantId);
    }
    if (activeStatus) {
      query.isActive = activeStatus === "true";
    }
    if (isPagination === "false") {
      const coupons = await Coupon.find(query)
        .populate("productscategory")
        .exec();
      return { coupons, total: coupons.length };
    } else {
      const coupons = await Coupon.find(query)
        .populate("product category")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await Coupon.countDocuments(query).exec();
      return { coupons, total };
    }
  }

  async getAllCouponsForUser(): Promise<{
    coupons: CouponsDoc[];
    total: number;
  }> {
    const currentDate = new Date();
    const query = { expireDate: { $gte: currentDate }, isActive: true };
    const coupons = await Coupon.find(query).exec();
    const total = coupons.length;
    return { coupons, total };
  }
  

  async updateCoupon(
    couponId: string,
    updateData: Partial<CouponsDoc>
  ): Promise<CouponsDoc | null> {
    return await Coupon.findByIdAndUpdate(couponId, updateData, {
      new: true,
    }).exec();
  }

  async deleteCoupon(couponId: string): Promise<CouponsDoc | null> {
    return await Coupon.findByIdAndDelete(couponId).exec();
  }

  async activateCoupon(couponId: string): Promise<CouponsDoc | null> {
    return await Coupon.findByIdAndUpdate(
      couponId,
      { activeInactive: true },
      { new: true }
    ).exec();
  }

  async deactivateCoupon(couponId: string): Promise<CouponsDoc | null> {
    return await Coupon.findByIdAndUpdate(
      couponId,
      { activeInactive: false },
      { new: true }
    ).exec();
  }
}

export const couponRepository = new CouponRepository();
