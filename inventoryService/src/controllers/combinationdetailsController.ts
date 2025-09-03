import { Request, Response } from 'express';
import {
    createCombinationDetails, getAllCombinationDetails, 
    getCombinationDetailsById,updateCombinationDetails,
     deleteCombinationDetails 
} from '../services/combinationdetailsService';
import { CreatecominationdetailsDTO, UpdatecombinationdetailsDTO } from "../dtos/combinationdeatilsDTO";
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';

export const createCombinationDetailsHandler = async (req: Request, res: Response) => {
  try {
    const detailsDto: CreatecominationdetailsDTO = req.body;
    const newCombinationdetails = await createCombinationDetails(detailsDto);
    responseWithData(res, 201, true, 'newCombinationdetails created successfully.', newCombinationdetails);
  } catch (error: any) {
    logger.error(`Error creating newCombinationdetails: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create newCombinationdetails.');
  }
};

export const getAllCombinationDetailsHandler = async (req: Request, res: Response) => {
  try {
    const combinationdetails = await getAllCombinationDetails();
    responseWithData(res, 200, true, 'combinationdetails retrieved successfully', combinationdetails);
  } catch (error: any) {
    logger.error(`Error retrieving combinationdetails: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve combinationdetails.');
  }
};

export const getCombinationDetailsByIdHandler = async (req: Request, res: Response) => {
  try {
    const detailsId = req.params.id;
    const combinationdetails = await getCombinationDetailsById(detailsId);
    if (!combinationdetails) {
      return errorResponse(res, 'combinationDetail not found', 404);
    }
    responseWithData(res, 200, true, 'combinationDetail retrieved successfully', combinationdetails);
  } catch (error: any) {
    logger.error(`Error retrieving combinationDetail: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve combinationDetail.');
  }
};

export const updateCombinationDetailsHandler = async (req: Request, res: Response) => {
  try {
    const detailsId = req.params.id;
    const detailsDto: UpdatecombinationdetailsDTO = req.body;
    const updatedCombinationdetails = await updateCombinationDetails(detailsId, detailsDto);
    if (!updatedCombinationdetails) {
      return errorResponse(res, 'Category not found', 404);
    }
    responseWithData(res, 200, true, 'Category updated successfully', updatedCombinationdetails);
  } catch (error: any) {
    logger.error(`Error updating category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update category.');
  }
};

export const deleteCombinationDetailsHandler = async (req: Request, res: Response) => {
  try {
    const detailsId = req.params.id;
    await deleteCombinationDetails(detailsId);
    responseWithoutData(res, 200, true, 'Category deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete category.');
  }
};
