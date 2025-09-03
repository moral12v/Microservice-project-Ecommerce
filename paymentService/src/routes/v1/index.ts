import express from "express";
import cors from "cors";

import { transcitionHistoryRoute } from "./transactionHistoryRoute";
import { invoiceRoute } from "./invoice";
import { paymentRoute } from "./paymentRoutes";

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
v1Api.use("/transactionHistory", transcitionHistoryRoute);
v1Api.use("/invoice", invoiceRoute )
v1Api.use("/payment", paymentRoute);
