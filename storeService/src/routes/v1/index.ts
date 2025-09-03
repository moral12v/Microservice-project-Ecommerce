import express from "express";
import cors from "cors";
import { storeRoute, storeAggregatorRoute } from "./store";
import { storeDeliveryTypeRoute } from "./storeDeliveryType";
import { mallRoute } from "./Mall";
// import { uploaderRoute } from "./uploader";
import { deliveryTypeRoute } from "./deliverytype";
import { planRoute, subscriptionRoute } from "./subscription";
import { deliveryChargesRoute } from "./deliveryCharges";
import configRoute from "./configRoute"; 

export const v1Api = express.Router();

v1Api.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/****************************
    UNAUTHENTICATED ROUTES
****************************/
v1Api.use("/store", storeRoute);
v1Api.use("/vendor/store", storeAggregatorRoute);
v1Api.use("/storeDeliveryType", storeDeliveryTypeRoute);
v1Api.use("/mall", mallRoute);
// v1Api.use("/upload", uploaderRoute);
v1Api.use('/deliveryType', deliveryTypeRoute)
v1Api.use("/subscription", subscriptionRoute);
v1Api.use("/plan", planRoute);
v1Api.use("/deliveryCharges", deliveryChargesRoute);
v1Api.use("/config", configRoute);
