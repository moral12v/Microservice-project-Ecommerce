import { ProductVarientDoc } from "../models/productvarient";
import { productvarientRepository } from "../repositories/productvarientRepository";
import { CreateProductVarientDTO, UpdateProductVarientDTO } from "../dtos/productVarientDTO";

export const createProductvarient = async (productvarientDto: CreateProductVarientDTO): Promise<ProductVarientDoc> => {
  return await productvarientRepository.createProductvarient(productvarientDto);
};

export const getAllProductvarient = async (): Promise<ProductVarientDoc[]> => {
  return await productvarientRepository.getAllProductvarient();
};

export const getProductvarientById = async (productvarientId: string): Promise<ProductVarientDoc | null> => {
  return await productvarientRepository.getProductvarientById(productvarientId);
};

export const updateProductvarient = async (productvarientId: string, updateDto: UpdateProductVarientDTO): Promise<ProductVarientDoc | null> => {
  return await productvarientRepository.updateProductvarient(productvarientId, updateDto);
};

export const deleteProductvarient = async (productvarientId: string): Promise<ProductVarientDoc | null> => {
  return await productvarientRepository.deleteProductvarient(productvarientId);
};

export const getProductvarientByCategory = async (categoryId: string): Promise<ProductVarientDoc[]> => {
  return await productvarientRepository.getProductvarientByCategory(categoryId);
};


