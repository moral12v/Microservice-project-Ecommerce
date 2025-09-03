import { Request, Response } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesForUser
} from '../services/categoryService';
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/categoryDTO"
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';


export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const categoryDto: CreateCategoryDTO = req.body;
    const newCategory = await createCategory(categoryDto);
    responseWithData(res, 201, true, 'Category created successfully.', newCategory);
  } catch (error: any) {
    logger.error(`Error retrieving categories: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve categories.');
  }
}


export const getAllCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    responseWithData(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error: any) {
    logger.error(`Error retrieving categories: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve categories.');
  }
};

export const getAllCategoriesForUserHandler = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesForUser();
    responseWithData(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error: any) {
    logger.error(`Error retrieving categories: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve categories.');
  }
};


export const getCategoryByIdHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    responseWithData(res, 200, true, 'Category retrieved successfully', category);
  } catch (error: any) {
    logger.error(`Error retrieving category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve category.');
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const categoryDto: UpdateCategoryDTO = req.body;
    const updatedCategory = await updateCategory(categoryId, categoryDto);
    if (!updatedCategory) {
      return errorResponse(res, 'Category not found', 404);
    }
    responseWithData(res, 200, true, 'Category updated successfully', updatedCategory);
  } catch (error: any) {
    logger.error(`Error updating category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update category.');
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    await deleteCategory(categoryId);
    responseWithoutData(res, 200, true, 'Category deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete category.');
  }
};
