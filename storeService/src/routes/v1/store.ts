import express from "express";
import * as storeController from "../../controllers/storeController";
import { registerStoreValidators } from "../../validators/storeValidator";
import { validateRequest } from "../../middlewares/validateRequest";
export const storeRoute = express.Router();
export const storeAggregatorRoute = express.Router();
import { vendorAuthentication } from "../../middlewares/vendorAunthetication";
import { optionalCustomerAuthentication } from "../../middlewares/optionalCustomerAuthentication";
import { storeAuthentication } from "../../middlewares/storeAuthentication";

// user Route

storeRoute.post("/",registerStoreValidators,validateRequest,storeController.registerStoreHandler);
storeRoute.get("/", storeController.getAllStoresHandler);
storeRoute.get("/getById/:id", storeController.getStoreByIdHandler);
storeRoute.get("/store-details/:id", storeController.getStoreDetailsWithBranchesHandler);
storeRoute.post("/login", storeController.storeLoginHandler);

storeRoute.get("/near-by", storeController.getNearByStoreHandler);
storeRoute.post("/near-by/filter", storeController.getNearByStoreFilterHandler);
storeRoute.get("/near-by-with-product",optionalCustomerAuthentication,storeController.getNearByStoreWithProductHandler);

storeRoute.patch("/update-timing-slot/:storeId",storeController.updateStoreTimingSlotHandler);
storeRoute.patch("/update-image/:storeId",storeController.updateStoreImageHandler);
storeRoute.patch("/update-Details/:storeId",storeController.updateStoreHandler);
storeRoute.get("/profile",storeAuthentication ,storeController.getStoreProfileHandler);
storeRoute.patch("/merchant/isOpen/:id" ,storeController.setStoreActiveStatusHandler);


// Vendor/Aggregator Route


storeAggregatorRoute.get( "/", vendorAuthentication,storeController.getAllAggregatortStoresFOrAggregatorHandler);
storeAggregatorRoute.post("/", vendorAuthentication, storeController.registerStoreFOrAggregatorHandler);

storeRoute.patch("/merchant-timing-slot/:storeId",vendorAuthentication,storeController.updateStoreTimingSlotHandler);
storeRoute.patch("/merchant-image/:storeId",vendorAuthentication,storeController.updateStoreImageHandler);
storeRoute.patch("/update-merchantDetails/:storeId",vendorAuthentication,storeController.updateStoreHandler);
storeRoute.post('/update-device-token',storeAuthentication, storeController.updateStoreDeviceId);