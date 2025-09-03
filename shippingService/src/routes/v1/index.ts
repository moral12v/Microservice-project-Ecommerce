import express from "express";
import cors from "cors";
import { shippingRouter } from "./shippingRoutes";

export const v1Api = express.Router();

v1Api.use(
  cors({
    origin: true,
    credentials: true,
  })
);

v1Api.use("/shipping", shippingRouter);
