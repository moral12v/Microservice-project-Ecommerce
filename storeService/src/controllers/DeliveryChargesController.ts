import { Request, Response, NextFunction } from "express";
import { deliveryChargesServices } from "../services/deliveryChargesService";
import {
  errorResponse,
  responseWithData,
  responseWithoutData,
} from "../utils/response";
import { trace } from '@opentelemetry/api';
import logger from "../utils/logger";

class DeliveryChargesController {
  
  async getAllDeliveryCharges(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getAllDeliveryCharges');
    span.setAttribute("http.method", "GET");
    try {
      const { merchantId } = req?.query;
      const merchantIdString = merchantId as string;
      const deliveryCharges =
        await deliveryChargesServices.getAllDeliveryCharges(merchantIdString);
      responseWithData(
        res,
        200,
        true,
        "Delivery Charges retrieved successfully.",
        deliveryCharges
      );
    } catch (error: any) {
      logger.error(`Error retrieving Delivery Charges: ${error.message}`);
      errorResponse(res, "Failed to retrieve Delivery Charges.");
    }
  }

  async updateDeliveryCharges(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('updateDeliveryCharges');
    span.setAttribute("http.method", "PATCH");
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedDeliveryCharge =
        await deliveryChargesServices.updateDeliveryCharges(id, updateData);

      if (!updatedDeliveryCharge) {
        responseWithoutData(res, 404, false, "Delivery Charge not found.");
        return;
      }

      responseWithData(
        res,
        200,
        true,
        "Delivery Charge updated successfully.",
        updatedDeliveryCharge
      );
    } catch (error: any) {
      logger.error(`Error updating Delivery Charge: ${error.message}`);
      errorResponse(res, "Failed to update Delivery Charge.");
    }
  }
}

export const deliveryChargesController = new DeliveryChargesController();
