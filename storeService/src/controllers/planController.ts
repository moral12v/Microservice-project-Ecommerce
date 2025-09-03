import { Request, Response, NextFunction } from "express";
import { planService } from "../services/planService";
import { errorResponse, responseWithData, responseWithoutData } from "../utils/response";
import { trace } from '@opentelemetry/api';
import logger from "../utils/logger";
import { CreatePlanDTO, UpdatePlanDTO } from "../dtos/planDTO"; 

class PlanController {
  async createPlan(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('createPlan');
    span.setAttribute("http.method", "POST");
    try {
      const data: CreatePlanDTO = req.body;
      const newPlan = await planService.createPlan(data);
      responseWithData(res, 201, true, "Plan created successfully.", newPlan);
    } catch (error: any) {
      logger.error(`Error creating plan: ${error.message}`);
      errorResponse(res, "Failed to create plan.");
    }
  }

  async getAllPlans(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getAllPlans');
    span.setAttribute("http.method", "GET");
    try {
      const plans = await planService.getAllPlans();
      responseWithData(res, 200, true, "Plans retrieved successfully.", plans);
    } catch (error: any) {
      logger.error(`Error retrieving plans: ${error.message}`);
      errorResponse(res, "Failed to retrieve plans.");
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getPlanById');
    span.setAttribute("http.method", "GET");
    try {
      const planId = req.params.id;
      const plan = await planService.getPlanById(planId);
      if (!plan) {
        return responseWithoutData(res, 404, false, "Plan not found.");
      }
      responseWithData(res, 200, true, "Plan retrieved successfully.", plan);
    } catch (error: any) {
      logger.error(`Error retrieving plan: ${error.message}`);
      errorResponse(res, "Failed to retrieve plan.");
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('updatePlan');
    span.setAttribute("http.method", "PATCH");
    try {
      const planId = req.params.id;
      const updateData: UpdatePlanDTO = req.body;
      const updatedPlan = await planService.updatePlan(planId, updateData);
      if (!updatedPlan) {
        return responseWithoutData(res, 404, false, "Plan not found.");
      }
      responseWithData(res, 200, true, "Plan updated successfully.", updatedPlan);
    } catch (error: any) {
      logger.error(`Error updating plan: ${error.message}`);
      errorResponse(res, "Failed to update plan.");
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('deletePlan');
    span.setAttribute("http.method", "DELETE");
    try {
      const planId = req.params.id;
      await planService.deletePlan(planId);
      responseWithoutData(res, 200, true, "Plan deleted successfully.");
    } catch (error: any) {
      logger.error(`Error deleting plan: ${error.message}`);
      errorResponse(res, "Failed to delete plan.");
    }
  }
}

export const planController = new PlanController();
