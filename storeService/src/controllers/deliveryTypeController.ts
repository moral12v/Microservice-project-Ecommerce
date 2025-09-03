import { Request, Response } from 'express';
import { trace } from '@opentelemetry/api';
import {
  createDeliveryType,
  updateDeliveryType,
  getDeliveryTypeById,
  getAllDeliveryType
} from '../services/deliveryTypeService'
import { CreateDeliveryTypeDTO, UpdateDeliveryTypeDTO } from '../dtos/deliveryTypeDTO';
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';

export const createDeliveryTypeHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('createDeliveryTypeHandler');
    span.setAttribute("http.method", "POST");
  try {
    const deliveryTypeDTO: CreateDeliveryTypeDTO = req.body;
    const newDeliveryType = await createDeliveryType(deliveryTypeDTO);
    responseWithData(res, 201, true, 'DeliveryType created successfully.', newDeliveryType);
  } catch (error: any) {
    logger.error(`Error creating DeliveryType: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create DeliveryType.');
  }
};


export const getAllDeliveryTypeHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getAllDeliveryTypeHandler');
    span.setAttribute("http.method", "GET");
  try {
    const deliveryType = await getAllDeliveryType();
    responseWithData(res, 200, true, 'DeliveryType retrieved successfully', deliveryType);
  } catch (error: any) {
    logger.error(`Error retrieving DeliveryType: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve DeliveryType.');
  }
};

export const getDeliveryTypeByIdHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('getDeliveryTypeByIdHandler');
    span.setAttribute("http.method", "GET");
  try {
    const deliveryTypeId = req.params.id;
    const deliveryType = await getDeliveryTypeById(deliveryTypeId);
    if (!deliveryTypeId) {
      return errorResponse(res, 'DeliveryType not found', 404);
    }
    responseWithData(res, 200, true, 'DeliveryType retrieved successfully', deliveryType);
  } catch (error: any) {
    logger.error(`Error retrieving DeliveryType: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve DeliveryType.');
  }
};

export const updateDeliveryTypeHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
    const span = tracer.startSpan('updateDeliveryTypeHandler');
    span.setAttribute("http.method", "POST");
  try {
    const deliveryTypeId = req.params.id;
    const deliveryTypeDTO: UpdateDeliveryTypeDTO = req.body;
    const updatedCategory = await updateDeliveryType(deliveryTypeId, deliveryTypeDTO);
    if (!updatedCategory) {
      return errorResponse(res, 'DeliveryType not found', 404);
    }
    responseWithData(res, 200, true, 'DeliveryType updated successfully', updatedCategory);
  } catch (error: any) {
    logger.error(`Error updating DeliveryType: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update DeliveryType.');
  }
};

// export const deleteCategoryAttributeHandler = async (req: Request, res: Response) => {
//   try {
//     const categoryattributeId = req.params.id;
//     await deleteCategoryAttribute(categoryattributeId);
//     responseWithoutData(res, 200, true, 'categoryattribute deleted successfully');
//   } catch (error: any) {
//     logger.error(`Error deleting categoryattribute: ${error.message}`);
//     errorResponse(res, error.message || 'Failed to delete categoryattribute.');
//   }
// };
