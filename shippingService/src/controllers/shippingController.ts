import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { errorResponse, responseWithData } from "../utils/response";
import { UnengageShippingProvider } from "../services/unengageShippingProvider";
import { ShippingProvider } from "../services/shippingProvider";
class ShippingController {
  private shippingProvider: ShippingProvider;

  constructor() {
    this.shippingProvider = new UnengageShippingProvider();
    this.fetchServicable = this.fetchServicable.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.trackOrder = this.trackOrder.bind(this);
    this.updateOrderStatusWebhook = this.updateOrderStatusWebhook.bind(this);
  }

  fetchServicable = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pickupDetails, dropDetails } = req.body;

      const servicability = await this.shippingProvider.getServicability(
        pickupDetails,
        dropDetails
      );

      responseWithData(
        res,
        200,
        true,
        "Servicability retrieved successfully.",
        servicability
      );
    } catch (error: any) {
      logger.error(`Error retrieving servicability: ${error.message}`);
      errorResponse(res, "Failed to retrieve servicability.");
    }
  };

  placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderDetails, pickupDetails, dropDetails, orderItems } = req.body;

      const order = await this.shippingProvider.placeOrder(
        orderDetails,
        pickupDetails,
        dropDetails,
        orderItems
      );

      responseWithData(res, 200, true, "Order placed successfully.", order);
    } catch (error: any) {
      logger.error(`Error placing order: ${error.message}`);
      errorResponse(res, "Failed to place order.");
    }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.body;

      const cancellation = await this.shippingProvider.cancelOrder(taskId);

      responseWithData(
        res,
        200,
        true,
        "Order cancelled successfully.",
        cancellation
      );
    } catch (error: any) {
      logger.error(`Error cancelling order: ${error.message}`);
      errorResponse(res, "Failed to cancel order.");
    }
  };

  trackOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.body;

      const tracking = await this.shippingProvider.trackOrder(taskId);

      responseWithData(
        res,
        200,
        true,
        "Order tracking information retrieved successfully.",
        tracking
      );
    } catch (error: any) {
      logger.error(`Error tracking order: ${error.message}`);
      errorResponse(res, "Failed to track order.");
    }
  };

  updateOrderStatusWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { payload } = req.body;

      const result = await this.shippingProvider.updateOrderStatusWebhook(
        payload
      );

      responseWithData(res, 200, true, result.message, result);
    } catch (error: any) {
      logger.error(`Error processing webhook: ${error.message}`);
      errorResponse(res, "Failed to process webhook.");
    }
  };
}

export const shippingController = new ShippingController();
