import express from "express";
import cors from "cors";
import { orderRoute } from "./order";
import { transcitionHistoryRoute } from "./transcitionHistory";
import { orderStatusRoute } from "./orderStatus";
import { orderDetailsRoute } from "./orderDetails";
import { OrderStatusLogRoute } from "./orderStatusLog";

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

v1Api.use("/order", orderRoute);
v1Api.use("/transctionHistory", transcitionHistoryRoute);
v1Api.use("/orderStatus", orderStatusRoute);
v1Api.use("/orderDetails", orderDetailsRoute);
v1Api.use("/orderStatusLog", OrderStatusLogRoute);
