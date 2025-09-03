import { RecentViewedProductsDTO } from "../dtos/recentviewedProductDTO";
import { recentViewedProductsRepository } from "../repositories/recentViewedProductRepository";

class RecentViewedProductsService {
  async getRecentViewedProductsByCustomerId(customerId: string) {
    return await recentViewedProductsRepository.findByCustomerId(customerId);
  }

  async createRecentViewedProducts(customerId: string) {
    let recentViewedProducts = await recentViewedProductsRepository.findByCustomerId(customerId);
    if (!recentViewedProducts) {
      recentViewedProducts = await recentViewedProductsRepository.createRecentViewedProducts(customerId);
    }
    return recentViewedProducts;
  }

  async addProductToRecentViewed(customerId: string, productId: string) {
    return await recentViewedProductsRepository.addProduct(customerId, productId);
  }

  async removeProductFromRecentViewed(customerId: string, productId: string) {
    return await recentViewedProductsRepository.removeProduct(customerId, productId);
  }
}

export const recentViewedProductsService = new RecentViewedProductsService();
