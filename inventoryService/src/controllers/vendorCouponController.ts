import { Request, Response } from 'express';
import {
  createVendorCoupon,
  deleteVendorCoupon,
  updateVendorCoupon,
  getAllVendorCoupons,
  activateVendorCoupon,
  deactivateVendorCoupon
} from '../services/vendorCouponService';
import { CreateVendorCouponsDTO, UpdateVendorCouponsDTO } from '../dtos/vendorCouponDTO';
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';

export const createVendorCouponHandler = async (req: Request, res: Response) => {
  try {
    const vendorCouponDTO: CreateVendorCouponsDTO = req.body;
    const newVendorCoupon = await createVendorCoupon(vendorCouponDTO);
    responseWithData(res, 201, true, 'Vendor Coupon created successfully.', newVendorCoupon);
  } catch (error: any) {
    logger.error(`Error creating Vendor Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create Vendor Coupon.');
  }
};

export const getAllVendorCouponsHandler = async (req: Request, res: Response) => {
  try {
    const vendorCoupons = await getAllVendorCoupons();
    responseWithData(res, 200, true, 'Vendor Coupons retrieved successfully', vendorCoupons);
  } catch (error: any) {
    logger.error(`Error retrieving Vendor Coupons: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve Vendor Coupons.');
  }
};

export const updateVendorCouponHandler = async (req: Request, res: Response) => {
  try {
    const vendorCouponId = req.params.id;
    const vendorCouponDTO: UpdateVendorCouponsDTO = req.body;
    const updatedVendorCoupon = await updateVendorCoupon(vendorCouponId, vendorCouponDTO);
    if (!updatedVendorCoupon) {
      return errorResponse(res, 'Vendor Coupon not found', 404);
    }
    responseWithData(res, 200, true, 'Vendor Coupon updated successfully', updatedVendorCoupon);
  } catch (error: any) {
    logger.error(`Error updating Vendor Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update Vendor Coupon.');
  }
};

export const deleteVendorCouponHandler = async (req: Request, res: Response) => {
  try {
    const vendorCouponId = req.params.id;
    await deleteVendorCoupon(vendorCouponId);
    responseWithoutData(res, 200, true, 'Vendor Coupon deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting Vendor Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete Vendor Coupon.');
  }
};

export const activateVendorCouponHandler = async (req: Request, res: Response) => {
  try {
    const vendorCouponId = req.params.id;
    const activatedVendorCoupon = await activateVendorCoupon(vendorCouponId);
    if (!activatedVendorCoupon) {
      return errorResponse(res, 'Vendor Coupon not found', 404);
    }
    responseWithData(res, 200, true, 'Vendor Coupon activated successfully', activatedVendorCoupon);
  } catch (error: any) {
    logger.error(`Error activating Vendor Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to activate Vendor Coupon.');
  }
};

export const deactivateVendorCouponHandler = async (req: Request, res: Response) => {
  try {
    const vendorCouponId = req.params.id;
    const deactivatedVendorCoupon = await deactivateVendorCoupon(vendorCouponId);
    if (!deactivatedVendorCoupon) {
      return errorResponse(res, 'Vendor Coupon not found', 404);
    }
    responseWithData(res, 200, true, 'Vendor Coupon deactivated successfully', deactivatedVendorCoupon);
  } catch (error: any) {
    logger.error(`Error deactivating Vendor Coupon: ${error.message}`);
    errorResponse(res, error.message || 'Failed to deactivate Vendor Coupon.');
  }
};

// export const applyVendorCouponHandler = async (req: Request, res: Response) => {
//     try {
//       const customerId = req.customer ? req.customer._id : "";
//       const { couponCode, totalAmount } = req.body;
  
//       const coupon = await vendorCouponService.findCouponByCode(couponCode);
//       if (!coupon || !coupon.activeInactive) {
//         return errorResponse(res, 'Invalid or inactive coupon', 400);
//       }
  
//       if (coupon.validTill < new Date()) {
//         return errorResponse(res, 'Coupon has expired', 400);
//       }
  
//       if (coupon.used && coupon.userId === customerId) {
//         return errorResponse(res, 'Coupon already used by this customer', 400);
//       }
  
//       if (coupon.usedCount >= coupon.usePerUser) {
//         return errorResponse(res, 'Coupon usage limit exceeded', 400);
//       }
  
//       let discountAmount = (totalAmount * coupon.discount) / 100;
//       if (discountAmount > coupon.maxDiscount) {
//         discountAmount = coupon.maxDiscount;
//       }
  
//       const finalAmount = totalAmount - discountAmount;
  
//       await vendorCouponService.updateCouponUsage(coupon._id, customerId);
  
//       responseWithData(res, 200, true, 'Coupon applied successfully', {
//         finalAmount,
//         discountAmount,
//         originalAmount: totalAmount,
//         couponCode: coupon.code,
//       });
//     } catch (error: any) {
//       logger.error(`Error applying Vendor Coupon: ${error.message}`);
//       errorResponse(res, error.message || 'Failed to apply Vendor Coupon.');
//     }
//   };