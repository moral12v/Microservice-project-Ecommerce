import express from "express";
import OrderStatusController from "../../controllers/orderStatusController";

export const orderStatusRoute = express.Router();

orderStatusRoute.post("/", OrderStatusController.createOrderStatus);
orderStatusRoute.get("/", OrderStatusController.getAllOrderStatuses);
orderStatusRoute.get("/:id", OrderStatusController.getOrderStatusById);
orderStatusRoute.patch("/:id", OrderStatusController.updateOrderStatus);

