import { Request, Response } from 'express';
import {
  createCoupon,
  deleteCoupon,
  updateCoupon,
  activateCoupon,
  deactivateCoupon, 
  getAllCouponsByMerchant,
  getAllCouponsForUser
} from '../services/couponService';
import { CreateCouponsDTO, UpdateCouponsDTO } from '../dtos/couponDTO';
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';

import { handleMerchantAuth } from '../kafka/handdlers/merchantAuth';


export const createCouponHandler = async (req: Request, res: Response) => {
  try {
    const merchantId = req.merchant ? req.merchant._id : "";
    const couponDto: CreateCouponsDTO = {
      ...req.body,
      merchantId,
    };
    const newCoupon = await createCoupon(couponDto);
    responseWithData(res, 201, true, "Coupon created successfully", newCoupon);
  } catch (error: any) {
    logger.error(`Error Creating Coupon: ${error.message}`);
    errorResponse(res, error.message || "Failed to create coupon");
  }
};

export const getAllCouponsByMerchantHandler = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 5, isPagination = true,  activeStatus = "" } = req.query;
    const merchantId = req.merchant ? req.merchant._id : "";
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const coupons = await getAllCouponsByMerchant(
      pageNumber,
      limitNumber,
      merchantId,
      isPagination as string,
      activeStatus as string
    );

    const response = {
      isPagination,
      page: pageNumber,
      limit: limitNumber,
      total: coupons.total,
      coupons: coupons.coupons,
    };

    responseWithData(res, 200, true, "Coupons retrieved successfully", response);
  } catch (error: any) {
    logger.error(`Error retrieving coupons: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve coupons.");
  }
};

export const getAllCouponsForUserHandler = async (req: Request, res: Response) => {
  try {
    const coupons = await getAllCouponsForUser();
    responseWithData(res, 200, true, "Coupons retrieved successfully", coupons);
  } catch (error: any) {
    logger.error(`Error retrieving coupons: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve coupons.");
  }
};


export const updateCouponHandler = async (req: Request, res: Response) => {
  try {
    const couponId = req.params.id;
    const couponDto: UpdateCouponsDTO = req.body;
    const updatedcoupon = await updateCoupon(couponId, couponDto);
    if (!updatedcoupon) {
      return errorResponse(res, 'Coupon not found', 404);
    }
    responseWithData(res, 200, true, 'Coupon updated successfully', updatedcoupon);
  } catch (error: any) {
    logger.error(`Error updating Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update Coupon.');
  }
};

export const deleteCouponHandler = async (req: Request, res: Response) => {
  try {
    const couponId = req.params.id;
    await deleteCoupon(couponId);
    responseWithoutData(res, 200, true, 'Coupon deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete Coupon.');
  }
};

export const activateCouponHandler = async (req: Request, res: Response) => {
    try {
      const couponId = req.params.id;
      const activatedCoupon = await activateCoupon(couponId);
      if (!activatedCoupon) {
        return errorResponse(res, 'Coupon not found', 404);
      }
      responseWithData(res, 200, true, 'Coupon activated successfully', activatedCoupon);
    } catch (error: any) {
      logger.error(`Error activating coupon: ${error.message}`);
      errorResponse(res, error.message || 'Failed to activate coupon.');
    }
};
  
export const deactivateCouponHandler = async (req: Request, res: Response) => {
    try {
      const couponId = req.params.id;
      const deactivatedCoupon = await deactivateCoupon(couponId);
      if (!deactivatedCoupon) {
        return errorResponse(res, 'Coupon not found', 404);
      }
      responseWithData(res, 200, true, 'Coupon deactivated successfully', deactivatedCoupon);
    } catch (error: any) {
      logger.error(`Error deactivating coupon: ${error.message}`);
      errorResponse(res, error.message || 'Failed to deactivate coupon.');
    }
};

export const ApplyCouponHandler = async (req: Request, res: Response) => {
  try {
    const customerId = req.customer ? req.customer._id : "";

  } catch (error: any) {
    logger.error(`Error deactivating coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to deactivate coupon.');
  }
};