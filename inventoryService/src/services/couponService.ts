import { CouponsDoc } from "../models/coupons";
import { couponRepository } from "../repositories/couponRepository";
import { CreateCouponsDTO, UpdateCouponsDTO } from "../dtos/couponDTO";

export const createCoupon = async (couponDto: CreateCouponsDTO): Promise<CouponsDoc> => {
  return await couponRepository.createCoupon(couponDto);
};

export const getAllCouponsByMerchant = async (
  page: number,
  limit: number,
  merchantId: string,
  isPagination: string,
  activeStatus: string
): Promise<{ coupons: CouponsDoc[]; total: number }> => {
  return await couponRepository.getAllCoupons(page, limit, merchantId, isPagination,  activeStatus);
};

export const updateCoupon = async (couponsId: string, couponDTO: UpdateCouponsDTO): Promise<CouponsDoc | null> => {
  return await couponRepository.updateCoupon(couponsId, couponDTO);
};

export const deleteCoupon = async (couponsId: string): Promise<void> => {
  await couponRepository.deleteCoupon(couponsId);
};

export const activateCoupon = async (couponId: string): Promise<CouponsDoc | null> => {
    return await couponRepository.activateCoupon(couponId);
};
  
export const deactivateCoupon  = async (couponId: string): Promise<CouponsDoc | null> => {
    return await couponRepository.deactivateCoupon(couponId);
};


export const getAllCouponsForUser = async (): Promise<{ coupons: CouponsDoc[]; total: number }> => {
  return await couponRepository.getAllCouponsForUser();
};