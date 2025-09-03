import express from "express";
import { AggregatorproductValidators } from "../../validators/AggregatorProduct";
import { MerchantProductValidators } from "../../validators/MerchantProduct";
import * as merchantProductController from "../../controllers/merchantProductController";
import * as aggregatorController from "../../controllers/aggregatorProductController";
import { recentViewedProductsController } from "../../controllers/recentviwedproductController";
import { customerAuthentication } from "../../middlewares/validateUser";
import { optionalCustomerAuthentication } from "../../middlewares/optionalCustomerAuthentication";
import { vendorAuthentication } from "../../middlewares/validateVendor";
import { merchantAuthentication } from "../../middlewares/validateMerchant";

export const productRoute = express.Router();

productRoute.post("/aggregator/",AggregatorproductValidators,aggregatorController.createAggregatorProducthandler);
productRoute.get("/aggregator",aggregatorController.getAllAggregatorProductHandler);
productRoute.get("/aggregator/:id",aggregatorController.getAgggregatorProductById);
productRoute.patch("/aggregator/:id",aggregatorController.updateAgggregatorProductHandler);
productRoute.patch("/admin/approve/:id",aggregatorController.approveProductHandler);
productRoute.patch("/admin/reject/:id", aggregatorController.rejectProductHandler);
productRoute.patch("/active/:id",aggregatorController.ActiveProductHandler);



//////MERCHANT PRODUCTS /////////////////


productRoute.post("/merchantProduct",MerchantProductValidators,merchantProductController.createMerchantProductHandler);
productRoute.get("/merchantProduct",merchantProductController.getAllMerchantProductsHandler);
productRoute.get("/merchantProduct/:id",merchantProductController.getMerchantProductByIdHandler);
productRoute.patch("/merchantProduct/:id",merchantProductController.updateMerchantProductHandler);
productRoute.get("/merchant/Product",optionalCustomerAuthentication,merchantProductController.getAllMerchantProductForUserHandler);
productRoute.post("/merchant/Product",optionalCustomerAuthentication,merchantProductController.getAllMerchantProductForUserWithFilterHandler);
productRoute.get( "/merchantsByCategory", merchantProductController.getMerchantsByCategoryController);
productRoute.post( "/varient/:id", merchantProductController.addVariantToProductHandler);
productRoute.patch( "/varient/:id/:variantId", merchantProductController.updateVariantInProductHandler);
productRoute.delete( "/varient/:id/:variantId", merchantProductController.deleteVariantFromProductHandler);
productRoute.get("/merchant",merchantAuthentication,merchantProductController.getMerchantsProductsBymerchantIdHandlerV2);
productRoute.patch("/merchantProduct/isActive/:id",merchantProductController.setMerchantProductActiveStatusHandler);
productRoute.patch("/merchantProduct/isAPProved/:id",merchantProductController.approveMerchantProductHandler);





// AddOns routes

productRoute.post("/addOn/:id", merchantProductController.addAddOnToProductHandler); 
productRoute.delete("/addOn/:id/:addOnId", merchantProductController.removeAddOnFromProductHandler);

//TAGS ROUTES

productRoute.post("/tags/:id", merchantProductController.addTagsToProductHandler); 
productRoute.delete("/tags/:id/:tagsId", merchantProductController.removeTagsFromProductHandler);

// Recent viewed Products

productRoute.post("/recent-viewed-products",customerAuthentication,recentViewedProductsController.addProduct);
productRoute.get("/recent-viewed-products",customerAuthentication,recentViewedProductsController.getRecentViewedProducts);
productRoute.delete("/recent-viewed-products",recentViewedProductsController.removeProduct);

// aggregator routes

productRoute.post("/aggregator/add",AggregatorproductValidators,vendorAuthentication,aggregatorController.createAggregatorProductForAggregatorhandler);
productRoute.get("/aggregator-get",vendorAuthentication,aggregatorController.getAllAggregatorProductForAggregatorhandler);
productRoute.get("/merchant/aggregator",merchantAuthentication,aggregatorController.getAllAggregatorProductForAggregatorhandlerv2);
productRoute.get("/aggregator-get/:id",vendorAuthentication,aggregatorController.getAgggregatorProductById);
productRoute.patch("/aggregator-update/:id",vendorAuthentication,aggregatorController.updateAgggregatorProductHandler);
productRoute.post("/aggregator/merchantProduct/add",MerchantProductValidators,vendorAuthentication, merchantProductController.createMerchantProductHandler);
productRoute.patch("/aggregator/merchantProduct/add/:id",MerchantProductValidators,vendorAuthentication, merchantProductController.updateMerchantProductHandler);
productRoute.get( "/aggregator/merchantProduct/get", vendorAuthentication,merchantProductController.getAllMerchantProductsHandler);
productRoute.get("/admin/merchant/Product/",merchantProductController.getAllMerchantProductForUserHandler);





productRoute.post("/merchant-Product/add",MerchantProductValidators,merchantAuthentication, merchantProductController.createMerchantProductForMerchantHandler);

// productRoute.get("/merchant",merchantAuthentication,merchantProductController.getMerchantsProductsBymerchantIdHandlerV2);