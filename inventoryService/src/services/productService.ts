import { ProductDoc } from "../models/product";
import { productRepository } from "../repositories/productRepository";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/productDTO";

export const createProduct = async (productDto: CreateProductDTO): Promise<ProductDoc> => {
  return await productRepository.createProduct(productDto);
};

export const getAllProducts = async (): Promise<ProductDoc[]> => {
  return await productRepository.getAllProducts();
};

export const getProductById = async (productId: string): Promise<ProductDoc | null> => {
  return await productRepository.getProductById(productId);
};

export const updateProduct = async (productId: string, updateDto: UpdateProductDTO): Promise<ProductDoc | null> => {
  return await productRepository.updateProduct(productId, updateDto);
};

export const deleteProduct = async (productId: string): Promise<ProductDoc | null> => {
  return await productRepository.deleteProduct(productId);
};

export const getProductsByCategory = async (categoryId: string): Promise<ProductDoc[]> => {
  return await productRepository.getProductsByCategory(categoryId);
};

export const getActiveProducts = async (): Promise<ProductDoc[]> => {
  return await productRepository.getActiveProducts();
};

// export const toggleProductStatus = async (productId: string): Promise<ProductDoc | null> => {
//   return await productRepository.updateProduct(productId);
// };

export const approveProductByAdmin = async (productId: string, approvedByAdmin: boolean): Promise<ProductDoc | null> => {
  return await productRepository.updateProduct(productId, { approvedByAdmin });
};
