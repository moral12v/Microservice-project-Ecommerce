import express from "express";
import OrderController from "../../controllers/orderController";
import { customerAuthentication } from "../../middlewares/validateUser";
import { merchantAuthentication } from "../../middlewares/ValidateMerchant";
import { vendorAuthentication } from "../../middlewares/validateVendor";

export const orderRoute = express.Router();

orderRoute.post("/place",customerAuthentication, OrderController.placeOrder);
orderRoute.get("/getByCustomer", customerAuthentication, OrderController.getOrdersByCustomerId);
orderRoute.get("/get-All", OrderController.getAllOrders);
orderRoute.get("/get-by-id/:orderId", OrderController.getOrderById);
orderRoute.get("/getByMerchant",merchantAuthentication,  OrderController.getOrdersByMerchantId);
orderRoute.patch("/updateStatus",  OrderController.updateOrderStatus);
orderRoute.get("/getForAggregator", vendorAuthentication, OrderController.getOrdersAggregator);
orderRoute.get("/get-ActiveOrders", customerAuthentication, OrderController.getActiveOrders);
orderRoute.get("/get-ActiveOrders/:orderId", customerAuthentication, OrderController.reOrderHanddler);