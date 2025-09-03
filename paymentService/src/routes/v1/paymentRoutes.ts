import express from "express";
import paymentController from "../../controllers/paymentController";

export const paymentRoute = express.Router();

paymentRoute.post("/callback", paymentController.handlePaymentCallback);
paymentRoute.get("/confirmation", paymentController.renderPaymentConfirmation);
paymentRoute.post("/verify", paymentController.verifyPayment);
