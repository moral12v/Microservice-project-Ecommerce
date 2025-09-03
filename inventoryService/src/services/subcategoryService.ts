import { SubcategoryDoc } from "../models/subcategory"
import { subcategoryRepository } from '../repositories/subcategoryRepository';
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "../dtos/subCategoryDTO"

export const createSubcategory = async (subcategoryDto: CreateSubCategoryDTO): Promise<SubcategoryDoc> => {
  return await subcategoryRepository.createSubcategory(subcategoryDto);
};

export const getAllSubcategories = async (categoryId:string): Promise<SubcategoryDoc[]> => {
  return await subcategoryRepository.getAllSubcategories(categoryId);
};

export const getSubcategoryById = async (subcategoryId: string): Promise<SubcategoryDoc | null> => {
  return await subcategoryRepository.getSubcategoryById(subcategoryId);
};

export const updateSubcategory = async (subcategoryId: string, updateDto: UpdateSubCategoryDTO): Promise<SubcategoryDoc | null> => {
  return await subcategoryRepository.updateSubcategory(subcategoryId, updateDto);
};

export const deleteSubcategory = async (subcategoryId: string): Promise<SubcategoryDoc | null> => {
  return await subcategoryRepository.deleteSubcategory(subcategoryId);
};

export const getSubcategoriesByCategoryId = async (categoryId: string): Promise<SubcategoryDoc[]> => {
  return await subcategoryRepository.getSubcategoriesByCategoryId(categoryId);
};
