import express from 'express';
import * as wishlistController from "../../controllers/wishlistController";
import * as bannerController from "../../controllers/bannerController"
import * as couponController from "../../controllers/couponController"
import * as categoryController from "../../controllers/categoryController"
import { validateRequest } from '../../middlewares/validateRequest';
import { customerAuthentication } from '../../middlewares/validateUser';
import { BannerValidators } from '../../validators/bannerValidator';
import { merchantAuthentication } from '../../middlewares/validateMerchant';

export const customerRoute = express.Router();

customerRoute.post("/wishlist",customerAuthentication, wishlistController.createWishListHandler)
customerRoute.get("/wishlist",customerAuthentication,  wishlistController.getWishListByCustomerIdHandler)
customerRoute.delete("/wishlist/:id",customerAuthentication, wishlistController.deleteWishListHandler)


customerRoute.post("/banner",validateRequest, bannerController.createBannerHandler)
customerRoute.get("/banner", bannerController.getAllBannersHandler)
customerRoute.patch("/update-banner/:id", bannerController.updateBannerHandler)
customerRoute.delete("/delete-banner/:id", bannerController.deleteBannerHandler)


customerRoute.post("/coupon", merchantAuthentication,couponController.createCouponHandler)
customerRoute.get("/coupon",merchantAuthentication, couponController.getAllCouponsByMerchantHandler)
customerRoute.get("/user-coupon", couponController.getAllCouponsForUserHandler)
customerRoute.patch("/coupon/:id",merchantAuthentication, couponController.updateCouponHandler)
customerRoute.delete("/coupon/:id", merchantAuthentication,couponController.deleteCouponHandler)
customerRoute.patch("/Active-coupon/:id",merchantAuthentication, couponController.activateCouponHandler)
customerRoute.patch("/deactive-coupon/:id",merchantAuthentication, couponController.deactivateCouponHandler)




customerRoute.get('/category/', categoryController.getAllCategoriesHandler);
customerRoute.get('/category-list/', categoryController.getAllCategoriesForUserHandler);
customerRoute.get('/category/:id', categoryController.getCategoryByIdHandler);
customerRoute.patch('/category/:id', categoryController.updateCategoryHandler);
customerRoute.delete('/category/:id', categoryController.deleteCategoryHandler);