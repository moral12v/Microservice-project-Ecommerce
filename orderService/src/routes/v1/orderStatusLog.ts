import express from "express";
import OrderStatusLogController from "../../controllers/orderStatusLogController";

export const OrderStatusLogRoute = express.Router();

OrderStatusLogRoute.post("/", OrderStatusLogController.createOrderStatusLog);
OrderStatusLogRoute.get("/", OrderStatusLogController.getAllOrderStatusLogs);
OrderStatusLogRoute.get("/:id", OrderStatusLogController.getOrderStatusLogById);
OrderStatusLogRoute.patch("/:id", OrderStatusLogController.updateOrderStatusLog);
OrderStatusLogRoute.delete("/:id", OrderStatusLogController.deleteOrderStatusLogById);