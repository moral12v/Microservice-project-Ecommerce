import express from 'express';
import * as productController from "../../controllers/productController"
import * as aggregatorController from "../../controllers/aggregatorProductController";
import * as wishlistController from "../../controllers/wishlistController";
import * as vendorCouponController from "../../controllers/vendorCouponController"
import { validateRequest } from '../../middlewares/validateRequest';

export const vendorRoute = express.Router();
export const aggregatorRoute = express.Router();




vendorRoute.post('/product/', validateRequest, productController.createProductHandler);
vendorRoute.get('/product/', productController.getAllProductsHandler);
vendorRoute.get('/product/:id', productController.getProductByIdHandler);
vendorRoute.patch('/product/:id', productController.updateProductHandler);
vendorRoute.delete('/product/:id', productController.deleteProductHandler);
vendorRoute.get('/products/category/:categoryId', productController.getProductsByCategoryHandler)
vendorRoute.get('/products/active', productController.getActiveProductsHandler)
// vendorRoute.patch('/products/:id/status', productController.toggleProductStatusHandler)
vendorRoute.patch('/products/:id/approve', productController.approveProductByAdminHandler)


////////vendorCoupon


vendorRoute.post('/vendor/coupon', vendorCouponController.createVendorCouponHandler)
vendorRoute.get('/vendorcoupon/', vendorCouponController.getAllVendorCouponsHandler);
vendorRoute.patch('/vendorcoupon/:id', vendorCouponController.updateVendorCouponHandler);
vendorRoute.delete('/vendorcoupon/:id', vendorCouponController.deleteVendorCouponHandler);
vendorRoute.patch('/vendorcoupon/activate/:id', vendorCouponController.activateVendorCouponHandler);
vendorRoute.patch('/vendorcoupon/deactivate/:id', vendorCouponController.deactivateVendorCouponHandler);
// vendorRoute.post('/vendorcoupon/apply', vendorCouponController.applyVendorCouponHandler);
