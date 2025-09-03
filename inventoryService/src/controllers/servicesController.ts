import { Request, Response } from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategoryId
} from '../services/serviceService';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/serviceDTO';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';

export const createServiceHandler = async (req: Request, res: Response) => {
  try {
    const serviceDto: CreateServiceDTO = req.body;
    const newService = await createService(serviceDto);
    responseWithData(res, 201, true, 'Service created successfully.', newService);
    logger.info(`Service created: ${newService}`);
  } catch (error: any) {
    logger.error(`Error creating service: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create service.');
  }
};

export const getAllServicesHandler = async (req: Request, res: Response) => {
  try {
    const services = await getAllServices();
    responseWithData(res, 200, true, 'Services retrieved successfully', services);
  } catch (error: any) {
    logger.error(`Error retrieving services: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve services.');
  }
};

export const getServiceByIdHandler = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    const service = await getServiceById(serviceId);
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }
    responseWithData(res, 200, true, 'Service retrieved successfully', service);
  } catch (error: any) {
    logger.error(`Error retrieving service: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve service.');
  }
};

export const updateServiceHandler = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    const updateDto: UpdateServiceDTO = req.body;
    const updatedService = await updateService(serviceId, updateDto);
    if (!updatedService) {
      return errorResponse(res, 'Service not found', 404);
    }
    responseWithData(res, 200, true, 'Service updated successfully', updatedService);
  } catch (error: any) {
    logger.error(`Error updating service: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update service.');
  }
};

export const deleteServiceHandler = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    await deleteService(serviceId);
    responseWithoutData(res, 200, true, 'Service deleted successfully');
    logger.info(`Service deleted: ${serviceId}`);
  } catch (error: any) {
    logger.error(`Error deleting service: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete service.');
  }
};

export const getServicesByCategoryIdHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const services = await getServicesByCategoryId(categoryId);
    responseWithData(res, 200, true, 'Services retrieved successfully', services);
  } catch (error: any) {
    logger.error(`Error retrieving services by category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve services by category.');
  }
};
