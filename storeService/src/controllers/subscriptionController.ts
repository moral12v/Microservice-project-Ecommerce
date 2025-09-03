
import { Request, Response, NextFunction } from "express";
import { subscriptionService } from "../services/subscriptionService";
import { errorResponse, responseWithData, responseWithoutData } from "../utils/response";
import { trace } from '@opentelemetry/api';
import logger from "../utils/logger";

class SubscriptionController {
  async createSubscription(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('createSubscription');
    span.setAttribute("http.method", "POST");
    try {
      const data = req.body;
      const newSubscription = await subscriptionService.createSubscription(data);
      responseWithData(res, 201, true, "Subscription created successfully.", newSubscription);
    } catch (error: any) {
      logger.error(`Error creating subscription: ${error.message}`);
      errorResponse(res, "Failed to create subscription.");
    }
  }

  async getAllSubscriptions(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getAllSubscriptions');
    span.setAttribute("http.method", "GET");
    try {
      const subscriptions = await subscriptionService.getAllSubscriptions();
      responseWithData(res, 200, true, "Subscriptions retrieved successfully.", subscriptions);
    } catch (error: any) {
      logger.error(`Error retrieving subscriptions: ${error.message}`);
      errorResponse(res, "Failed to retrieve subscriptions.");
    }
  }

  async getSubscriptionById(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getSubscriptionById');
    span.setAttribute("http.method", "GET");
    try {
      const subscriptionId = req.params.id;
      const subscription = await subscriptionService.getSubscriptionById(subscriptionId);
      if (!subscription) {
        return responseWithoutData(res, 404, false, "Subscription not found.");
      }
      responseWithData(res, 200, true, "Subscription retrieved successfully.", subscription);
    } catch (error: any) {
      logger.error(`Error retrieving subscription: ${error.message}`);
      errorResponse(res, "Failed to retrieve subscription.");
    }
  }

  async updateSubscription(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('updateSubscription');
    span.setAttribute("http.method", "PATCH");
    try {
      const subscriptionId = req.params.id;
      const updateData = req.body;
      const updatedSubscription = await subscriptionService.updateSubscription(subscriptionId, updateData);
      if (!updatedSubscription) {
        return responseWithoutData(res, 404, false, "Subscription not found.");
      }
      responseWithData(res, 200, true, "Subscription updated successfully.", updatedSubscription);
    } catch (error: any) {
      logger.error(`Error updating subscription: ${error.message}`);
      errorResponse(res, "Failed to update subscription.");
    }
  }

  async deleteSubscription(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('deleteSubscription');
    span.setAttribute("http.method", "DELETE");
    try {
      const subscriptionId = req.params.id;
      await subscriptionService.deleteSubscription(subscriptionId);
      responseWithoutData(res, 200, true, "Subscription deleted successfully.");
    } catch (error: any) {
      logger.error(`Error deleting subscription: ${error.message}`);
      errorResponse(res, "Failed to delete subscription.");
    }
  }
}

export const subscriptionController = new SubscriptionController();
