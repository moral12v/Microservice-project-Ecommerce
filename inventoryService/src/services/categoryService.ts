import { CategoryDoc } from "../models/category"
import { categoryRepository } from '../repositories/categoryRepository';
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/categoryDTO"


export const createCategory = async (categoryDto: CreateCategoryDTO): Promise<CategoryDoc> => {
  return await categoryRepository.createCategory(categoryDto);
}

export const getAllCategories = async (): Promise<CategoryDoc[]> => {
  return await categoryRepository.getAllCategories();
};

export const getAllCategoriesForUser = async (): Promise<CategoryDoc[]> => {
  return await categoryRepository.getAllCategorieForUser();
};


export const getCategoryById = async (categoryId: string): Promise<CategoryDoc | null> => {
  return await categoryRepository.getCategoryById(categoryId);
};

export const updateCategory = async (categoryId: string, categoryDto: UpdateCategoryDTO): Promise<CategoryDoc | null> => {
  return await categoryRepository.updateCategory(categoryId, categoryDto);
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await categoryRepository.deleteCategory(categoryId);
};
