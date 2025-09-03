import { Types } from "mongoose";
import recentViwedProducts,{RecentViewedProductsDoc} from "../models/recentViwedProducts";

class RecentViewedProductsRepository {

  async findByCustomerId(customerId: string): Promise<RecentViewedProductsDoc | null> {
    return await recentViwedProducts
      .findOne({ customerId })
      .populate('products') 
      .exec();
  }

  async createRecentViewedProducts(customerId: string): Promise<RecentViewedProductsDoc> {
    const newRecentViewedProducts = new recentViwedProducts({ customerId, products: [] });
    return await newRecentViewedProducts.save();
  }


  async addProduct(customerId: string, productId: string): Promise<RecentViewedProductsDoc | null> {
    return await recentViwedProducts.findOneAndUpdate(
      { customerId },
      { $addToSet: { products: productId } }, 
      { new: true, upsert: true }
    ).exec();
  }

  async removeProduct(customerId: string, productId: string): Promise<RecentViewedProductsDoc | null> {
    return await recentViwedProducts.findOneAndUpdate(
      { customerId },
      { $pull: { products: productId } },
      { new: true }
    ).exec();
  }

}

export const recentViewedProductsRepository = new RecentViewedProductsRepository();
