import { Request, Response } from 'express';
import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategoryId
} from '../services/subcategoryService';
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "../dtos/subCategoryDTO"
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';

export const createSubcategoryHandler = async (req: Request, res: Response) => {
  try {
    const subcategoryDto: CreateSubCategoryDTO = req.body;
    const newSubcategory = await createSubcategory(subcategoryDto);
    responseWithData(res, 201, true, 'Subcategory created successfully.', newSubcategory);
    logger.info(`Subcategory created: ${newSubcategory}`);
  } catch (error: any) {
    logger.error(`Error creating subcategory: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create subcategory.');
  }
};

export const getAllSubcategoriesHandler = async (req: Request, res: Response) => {
  try {
    const {  categoryId } = req.query;
    const cId = categoryId as string;
    const subcategories = await getAllSubcategories(cId);
    responseWithData(res, 200, true, 'Subcategories retrieved successfully', subcategories);
  } catch (error: any) {
    logger.error(`Error retrieving subcategories: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve subcategories.');
  }
};

export const getSubcategoryByIdHandler = async (req: Request, res: Response) => {
  try {
    const subcategoryId = req.params.id;
    const subcategory = await getSubcategoryById(subcategoryId);
    if (!subcategory) {
      return errorResponse(res, 'Subcategory not found', 404);
    }
    responseWithData(res, 200, true, 'Subcategory retrieved successfully', subcategory);
  } catch (error: any) {
    logger.error(`Error retrieving subcategory: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve subcategory.');
  }
};

export const updateSubcategoryHandler = async (req: Request, res: Response) => {
  try {
    const subcategoryId = req.params.id;
    const updateDto: UpdateSubCategoryDTO = req.body;
    const updatedSubcategory = await updateSubcategory(subcategoryId, updateDto);
    if (!updatedSubcategory) {
      return errorResponse(res, 'Subcategory not found', 404);
    }
    responseWithData(res, 200, true, 'Subcategory updated successfully', updatedSubcategory);
  } catch (error: any) {
    logger.error(`Error updating subcategory: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update subcategory.');
  }
};

export const deleteSubcategoryHandler = async (req: Request, res: Response) => {
  try {
    const subcategoryId = req.params.id;
    await deleteSubcategory(subcategoryId);
    responseWithoutData(res, 200, true, 'Subcategory deleted successfully');
    logger.info(`Subcategory deleted: ${subcategoryId}`);
  } catch (error: any) {
    logger.error(`Error deleting subcategory: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete subcategory.');
  }
};

export const getSubcategoriesByCategoryIdHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId)
    const subcategories = await getSubcategoriesByCategoryId(categoryId);

    responseWithData(res, 200, true, 'Subcategories retrieved successfully', subcategories);
  } catch (error: any) {
    logger.error(`Error retrieving subcategories by category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve subcategories by category.');
  }
};

