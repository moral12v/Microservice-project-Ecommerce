import { Request, Response } from "express";
import {
  createCategoryAttribute,
  updateCategoryAttribute,
  deleteCategoryAttribute,
  getAllCategoriesAttribute,
  getCategoryAttributeById,
} from "../services/categoryattributeService";
import {
  CreateCategoryAttributesDTO,
  UpdateCategoryAttributesDTO,
} from "../dtos/categoryattributesDTO";
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from "../utils/response";
import logger from "../utils/logger";

export const createCategoryAttributeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryattributeDto: CreateCategoryAttributesDTO = req.body;
    const newCategoryAttribute = await createCategoryAttribute(
      categoryattributeDto
    );
    responseWithData(
      res,
      201,
      true,
      "CategoryAttribute created successfully.",
      newCategoryAttribute
    );
  } catch (error: any) {
    logger.error(`Error creating CategoryAttribute: ${error.message}`);
    errorResponse(res, error.message || "Failed to create CategoryAttribute.");
  }
};

export const getAllCategoriesAttributeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {categoryId} = req?.query;
    const categoryIdString = categoryId as string
    const categoryattributes = await getAllCategoriesAttribute(categoryIdString);
    responseWithData(res, 200, true, 'categoryattributes retrieved successfully', categoryattributes);
  } catch (error: any) {
    logger.error(`Error retrieving categoryattributes: ${error.message}`);
    errorResponse(
      res,
      error.message || "Failed to retrieve categoryattributes."
    );
  }
};

export const getCategoryAttributeByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryattributeId = req.params.id;
    const categoryattribute = await getCategoryAttributeById(
      categoryattributeId
    );
    if (!categoryattributeId) {
      return errorResponse(res, "categoryattribute not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "category attribute retrieved successfully",
      categoryattribute
    );
  } catch (error: any) {
    logger.error(`Error retrieving category attribute: ${error.message}`);
    errorResponse(
      res,
      error.message || "Failed to retrieve categoryattribute."
    );
  }
};

export const updateCategoryAttributeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryattributeId = req.params.id;
    const categoryattributeDto: UpdateCategoryAttributesDTO = req.body;
    const updatedCategory = await updateCategoryAttribute(
      categoryattributeId,
      categoryattributeDto
    );
    if (!updatedCategory) {
      return errorResponse(res, "categoryattribute not found", 404);
    }
    responseWithData(
      res,
      200,
      true,
      "categoryattribute updated successfully",
      updatedCategory
    );
  } catch (error: any) {
    logger.error(`Error updating categoryattribute: ${error.message}`);
    errorResponse(res, error.message || "Failed to update categoryattribute.");
  }
};

export const deleteCategoryAttributeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryattributeId = req.params.id;
    await deleteCategoryAttribute(categoryattributeId);
    responseWithoutData(
      res,
      200,
      true,
      "categoryattribute deleted successfully"
    );
  } catch (error: any) {
    logger.error(`Error deleting categoryattribute: ${error.message}`);
    errorResponse(res, error.message || "Failed to delete categoryattribute.");
  }
};
