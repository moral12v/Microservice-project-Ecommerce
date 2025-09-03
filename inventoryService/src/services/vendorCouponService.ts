import { vendorCouponsDoc } from "../models/vendorCoupon";
import { vendorCouponRepository } from "../repositories/vendorCouponRepository";
import { CreateVendorCouponsDTO, UpdateVendorCouponsDTO } from "../dtos/vendorCouponDTO";

export const createVendorCoupon = async (vendorCouponDTO: CreateVendorCouponsDTO): Promise<vendorCouponsDoc> => {
  return await vendorCouponRepository.createVendorCoupon(vendorCouponDTO);
};

export const getAllVendorCoupons = async (): Promise<vendorCouponsDoc[]> => {
  return await vendorCouponRepository.getAllVendorCoupons();
};

export const updateVendorCoupon = async (vendorCouponId: string, vendorCouponDTO: UpdateVendorCouponsDTO): Promise<vendorCouponsDoc | null> => {
  return await vendorCouponRepository.updateVendorCoupon(vendorCouponId, vendorCouponDTO);
};

export const deleteVendorCoupon = async (vendorCouponId: string): Promise<void> => {
  await vendorCouponRepository.deleteVendorCoupon(vendorCouponId);
};

export const activateVendorCoupon = async (vendorCouponId: string): Promise<vendorCouponsDoc | null> => {
  return await vendorCouponRepository.activateVendorCoupon(vendorCouponId);
};

export const deactivateVendorCoupon = async (vendorCouponId: string): Promise<vendorCouponsDoc | null> => {
  return await vendorCouponRepository.deactivateVendorCoupon(vendorCouponId);
};
