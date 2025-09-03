import express from "express";
import cors from "cors";
import { AdminRoute } from "./Admin";
import { vendorRoute } from "./vendor";
import { combinationdetailsRoute } from "./combinationdetails";
import { productRoute } from "./product";
import { customerRoute } from "./customer";
import { cartRoutes } from "./cart";
import { checkoutRoute } from "./checkout";
import { AddonRoute } from "./Addon";
import addonMetaRoute from "./addonMetaData";
import { productCategoryRoute } from "./productCategoryMetaData";
import { reOrderRoute } from "./reOrder";


export const v1Api = express.Router();

v1Api.use(cors({
  origin: true,
  credentials: true
}));


/****************************
    UNAUTHENTICATED ROUTES
/****************************/

v1Api.use('/Admin', AdminRoute);
v1Api.use('/vendor', vendorRoute);
v1Api.use('/combination-details', combinationdetailsRoute)
v1Api.use('/product', productRoute)
v1Api.use('/customer', customerRoute)
v1Api.use('/cart', cartRoutes)
v1Api.use('/checkout', checkoutRoute)
v1Api.use('/addon', AddonRoute)
v1Api.use('/productCategory', productCategoryRoute)
v1Api.use('/addonMeta', addonMetaRoute)
v1Api.use('/re-order', reOrderRoute)
