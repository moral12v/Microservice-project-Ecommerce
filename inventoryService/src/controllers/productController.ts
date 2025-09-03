import { Request, Response } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getActiveProducts,
  // toggleProductStatus,
  approveProductByAdmin,
} from '../services/productService';
import {
  CreateProductDTO,
  UpdateProductDTO,
} from '../dtos/productDTO';
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const productDto: CreateProductDTO = req.body;
    const newProduct = await createProduct(productDto);
    responseWithData(res, 201, true, 'Product created successfully.', newProduct);
  } catch (error: any) {
    logger.error(`Error creating product: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create product.');
  }
};

export const getAllProductsHandler = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    responseWithData(res, 200, true, 'Products retrieved successfully', products);
  } catch (error: any) {
    logger.error(`Error retrieving products: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve products.');
  }
}

export const getProductByIdHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    responseWithData(res, 200, true, 'Product retrieved successfully', product);
  } catch (error: any) {
    logger.error(`Error retrieving product: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve product.');
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const productDto: UpdateProductDTO = req.body;
    const updatedProduct = await updateProduct(productId, productDto);
    if (!updatedProduct) {
      return errorResponse(res, 'Product not found', 404);
    }
    responseWithData(res, 200, true, 'Product updated successfully', updatedProduct);
  } catch (error: any) {
    logger.error(`Error updating product: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update product.');
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    await deleteProduct(productId);
    responseWithoutData(res, 200, true, 'Product deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting product: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete product.');
  }
};

export const getProductsByCategoryHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await getProductsByCategory(categoryId);
    responseWithData(res, 200, true, 'Products retrieved by category successfully', products);
  } catch (error: any) {
    logger.error(`Error retrieving products by category: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve products by category.');
  }
};

export const getActiveProductsHandler = async (req: Request, res: Response) => {
  try {
    const products = await getActiveProducts();
    responseWithData(res, 200, true, 'Active products retrieved successfully', products);
  } catch (error: any) {
    logger.error(`Error retrieving active products: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve active products.');
  }
};

// export const toggleProductStatusHandler = async (req: Request, res: Response) => {
//   try {
//     const productId = req.params.id;
//     const { active } = req.body;
//     const updatedProduct = await toggleProductStatus(productId, active);
//     if (!updatedProduct) {
//       return errorResponse(res, 'Product not found', 404);
//     }
//     const statusMessage = active ? 'activated' : 'deactivated';
//     responseWithData(res, 200, true, `Product ${statusMessage} successfully`, updatedProduct);
//   } catch (error: any) {
//     logger.error(`Error updating product status: ${error.message}`);
//     errorResponse(res, error.message || 'Failed to update product status.');
//   }
// };

export const approveProductByAdminHandler = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const { approvedByAdmin } = req.body;
    const updatedProduct = await approveProductByAdmin(productId, approvedByAdmin);
    if (!updatedProduct) {
      return errorResponse(res, 'Product not found', 404);
    }
    const approvalMessage = approvedByAdmin ? 'approved' : 'disapproved';
    responseWithData(res, 200, true, `Product ${approvalMessage} successfully`, updatedProduct);
  } catch (error: any) {
    logger.error(`Error approving product: ${error.message}`);
    errorResponse(res, error.message || 'Failed to approve product.');
  }
};
