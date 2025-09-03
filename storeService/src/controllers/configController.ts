import { Request, Response, NextFunction } from "express";
import { configService } from "../services/configService";
import { errorResponse, responseWithData, responseWithoutData } from "../utils/response";
import { trace } from '@opentelemetry/api';
import logger from "../utils/logger";
import { CreateConfigDTO, UpdateConfigDTO } from "../dtos/configDTO"; 

class ConfigController {
  async createConfig(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('createConfig');
    span.setAttribute("http.method", "POST");
    try {
      const data: CreateConfigDTO = req.body;
      const newConfig = await configService.createConfig(data);
      responseWithData(res, 201, true, "Configuration created successfully.", newConfig);
    } catch (error: any) {
      logger.error(`Error creating configuration: ${error.message}`);
      errorResponse(res, "Failed to create configuration.");
    } finally {
      span.end();
    }
  }

  async getAllConfigs(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getAllConfigs');
    span.setAttribute("http.method", "GET");
    try {
      const configs = await configService.getAllConfigs();
      responseWithData(res, 200, true, "Configurations retrieved successfully.", configs);
    } catch (error: any) {
      logger.error(`Error retrieving configurations: ${error.message}`);
      errorResponse(res, "Failed to retrieve configurations.");
    } finally {
      span.end();
    }
  }

  async getConfigById(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getConfigById');
    span.setAttribute("http.method", "GET");
    try {
      const configId = req.params.id;
      const config = await configService.getConfigById(configId);
      if (!config) {
        return responseWithoutData(res, 404, false, "Configuration not found.");
      }
      responseWithData(res, 200, true, "Configuration retrieved successfully.", config);
    } catch (error: any) {
      logger.error(`Error retrieving configuration: ${error.message}`);
      errorResponse(res, "Failed to retrieve configuration.");
    } finally {
      span.end();
    }
  }

  async updateConfig(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('updateConfig');
    span.setAttribute("http.method", "PATCH");
    try {
      const configId = req.params.id;
      const updateData: UpdateConfigDTO = req.body;
      const updatedConfig = await configService.updateConfig(configId, updateData);
      if (!updatedConfig) {
        return responseWithoutData(res, 404, false, "Configuration not found.");
      }
      responseWithData(res, 200, true, "Configuration updated successfully.", updatedConfig);
    } catch (error: any) {
      logger.error(`Error updating configuration: ${error.message}`);
      errorResponse(res, "Failed to update configuration.");
    } finally {
      span.end();
    }
  }

  async deleteConfig(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('deleteConfig');
    span.setAttribute("http.method", "DELETE");
    try {
      const configId = req.params.id;
      await configService.deleteConfig(configId);
      responseWithoutData(res, 200, true, "Configuration deleted successfully.");
    } catch (error: any) {
      logger.error(`Error deleting configuration: ${error.message}`);
      errorResponse(res, "Failed to delete configuration.");
    } finally {
      span.end();
    }
  }

  async getConfigByModelKey(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getConfigByModelKey');
    span.setAttribute("http.method", "GET");
    try {
      const modelKey = req.params.modelKey;
      const config = await configService.getConfigByModelKey(modelKey);
      if (!config) {
        return responseWithoutData(res, 404, false, "Configuration not found for the specified model key.");
      }
      responseWithData(res, 200, true, "Configuration retrieved successfully.", config);
    } catch (error: any) {
      logger.error(`Error retrieving configuration by model key: ${error.message}`);
      errorResponse(res, "Failed to retrieve configuration.");
    } finally {
      span.end();
    }
  }
}

export const configController = new ConfigController();
