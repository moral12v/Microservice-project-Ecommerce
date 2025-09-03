import express from "express";
import cors from "cors";
import { notifiactionRoute } from "./notificationRoutes";




export const v1Api = express.Router();

v1Api.use(cors({
  origin: true,
  credentials: true
}));


/****************************
    UNAUTHENTICATED ROUTES
****************************/
v1Api.use('/notification', notifiactionRoute);