import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { shippingController } from "../../controllers/shippingController";

export const shippingRouter = express.Router();

shippingRouter.post(
  "/fetch-servicable",
  validateRequest,
  shippingController.fetchServicable
);

shippingRouter.post(
  "/place-order",
  validateRequest,
  shippingController.placeOrder
);

shippingRouter.post(
  "/cancel-Order",
  validateRequest,
  shippingController.cancelOrder
);

shippingRouter.patch(
  "/update-Order",
  validateRequest,
  shippingController.updateOrderStatusWebhook
);
