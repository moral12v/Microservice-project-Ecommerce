import { Request, Response, NextFunction } from "express";
import { recentViewedProductsService } from "../services/recentviewedProductService";
import { errorResponse, responseWithData, responseWithoutData } from "../utils/response";
import logger from "../utils/logger";

class RecentViewedProductsController {

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const { productId } = req.body;
      let recentViewedProducts = await recentViewedProductsService.getRecentViewedProductsByCustomerId(customerId);
      if (!recentViewedProducts) {
        recentViewedProducts = await recentViewedProductsService.createRecentViewedProducts(customerId);
      }
      const updatedRecentViewedProducts = await recentViewedProductsService.addProductToRecentViewed(customerId, productId);
      console.log(updatedRecentViewedProducts)
      responseWithData(res, 200, true, 'Product added to recent viewed products successfully.', updatedRecentViewedProducts);
    } catch (error: any) {
    
      logger.error(`Error adding product to recent viewed products: ${error.message}`);
      errorResponse(res, 'Failed to add product to recent viewed products.');
    }
  }

  async getRecentViewedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const recentViewedProducts = await recentViewedProductsService.getRecentViewedProductsByCustomerId(customerId);
      responseWithData(res, 200, true, 'Recent viewed products retrieved successfully.', recentViewedProducts);
    } catch (error: any) {
      logger.error(`Error retrieving recent viewed products: ${error.message}`);
      errorResponse(res, 'Failed to retrieve recent viewed products.');
    }
  }

  async removeProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.customer ? req.customer._id : "";
      const { productId } = req.body;
      const recentViewedProducts = await recentViewedProductsService.getRecentViewedProductsByCustomerId(customerId);
      if (!recentViewedProducts) {
        return responseWithoutData(res, 404, false, 'Recent viewed products not found.');
      }
      const updatedRecentViewedProducts = await recentViewedProductsService.removeProductFromRecentViewed(customerId, productId);
      responseWithData(res, 200, true, 'Product removed from recent viewed products successfully.', updatedRecentViewedProducts);
    } catch (error: any) {
      logger.error(`Error removing product from recent viewed products: ${error.message}`);
      errorResponse(res, 'Failed to remove product from recent viewed products.');
    }
  }

}

export const recentViewedProductsController = new RecentViewedProductsController();
