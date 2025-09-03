import { categoryAttributeRepository } from "../repositories/categoryattributesRepository";
import { CreateCategoryAttributesDTO, UpdateCategoryAttributesDTO } from "../dtos/categoryattributesDTO";
import { CategoryAttributesDoc } from "../models/CategoryAttributes";

export const createCategoryAttribute = async (categoryDto: CreateCategoryAttributesDTO): Promise<CategoryAttributesDoc> => {
  return await categoryAttributeRepository.createCategoryAttribute(categoryDto);
};

export const getAllCategoriesAttribute = async (categoryIdString:string): Promise<CategoryAttributesDoc[]> => {
  return await categoryAttributeRepository.getAllCategoryAttributes(categoryIdString);
};

export const getCategoryAttributeById = async (categoryId: string): Promise<CategoryAttributesDoc | null> => {
  return await categoryAttributeRepository.getCategoryAttributeById(categoryId);
};

export const updateCategoryAttribute = async (categoryId: string, categoryDto: UpdateCategoryAttributesDTO): Promise<CategoryAttributesDoc | null> => {
  return await categoryAttributeRepository.updateCategoryAttribute(categoryId, categoryDto);
};

export const deleteCategoryAttribute = async (categoryId: string): Promise<void> => {
  await categoryAttributeRepository.deleteCategoryAttribute(categoryId);
};
