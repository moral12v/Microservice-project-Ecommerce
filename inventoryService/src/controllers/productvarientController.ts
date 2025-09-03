import { Request, Response } from 'express';
import {
    createProductvarient,
    getAllProductvarient,
    getProductvarientByCategory,
    updateProductvarient, 
    deleteProductvarient,
    getProductvarientById
} from '../services/productvarientService';
import { CreateProductVarientDTO, UpdateProductVarientDTO } from "../dtos/productVarientDTO"
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';

export const createproductvarientHandler = async (req: Request, res: Response) => {
  try {
    const productVarientDTO: CreateProductVarientDTO = req.body;
    const newproductvarient = await createProductvarient(productVarientDTO);
    responseWithData(res, 201, true, 'productvarient created successfully.', newproductvarient);
  } catch (error: any) {
    logger.error(`Error creating productvarient: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create productvarient.');
  }
};

export const getAllProductvarientHandler = async (req: Request, res: Response) => {
    try {
      const productvarient = await getAllProductvarient();
      responseWithData(res, 200, true, 'productvarient retrieved successfully', productvarient);
    } catch (error: any) {
      logger.error(`Error retrieving productvarient: ${error.message}`);
      errorResponse(res, error.message || 'Failed to retrieve productvarient.');
    }
  }

export const getproductvarientByIdHandler = async (req: Request, res: Response) => {
  try {
    const productvarientId = req.params.id;
    const productvarient = await getProductvarientById(productvarientId);
    if (!productvarient) {
      return errorResponse(res, 'productvarient not found', 404);
    }
    responseWithData(res, 200, true, 'productvarient retrieved successfully', productvarient);
  } catch (error: any) {
    logger.error(`Error retrieving productvarient: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve productvarient.');
  }
};

export const updateProductvarientHandler = async (req: Request, res: Response) => {
  try {
    const productvarientId = req.params.id;
    const productvarientDto: UpdateProductVarientDTO = req.body;
    const updatedProductvarient = await updateProductvarient(productvarientId, productvarientDto);
    if (!updatedProductvarient) {
      return errorResponse(res, 'Category not found', 404);
    }
    responseWithData(res, 200, true, 'Productvarient updated successfully', updatedProductvarient);
  } catch (error: any) {
    logger.error(`Error updating Productvarient: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update Productvarient.');
  }
};

export const deleteProductvarientHandler = async (req: Request, res: Response) => {
  try {
    const productvarientId = req.params.id;
    await deleteProductvarient(productvarientId);
    responseWithoutData(res, 200, true, 'Productvarient deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting Productvarient: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete Productvarient.');
  }
};
