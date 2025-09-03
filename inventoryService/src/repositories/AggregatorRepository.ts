import mongoose from "mongoose";
import AggregatorProduct, {
  AggregatorProductDoc,
} from "../models/aggregatorProduct";

export class AggregatorProductRepository {
  async createAggregatorProduct(
    attributeData: Partial<AggregatorProductDoc>
  ): Promise<AggregatorProductDoc> {
    const aggregatorProduct = new AggregatorProduct(attributeData);
    return await aggregatorProduct.save();
  }

  async getAggregatorProductById(
    aggregatorId: string
  ): Promise<AggregatorProductDoc | null> {
    return await AggregatorProduct.findById(aggregatorId).exec();
  }

  async UpdateAggregatorProduct(
    aggregatorId: string,
    updateData: Partial<AggregatorProductDoc>
  ): Promise<AggregatorProductDoc | null> {
    return await AggregatorProduct.findByIdAndUpdate(aggregatorId, updateData, {
      new: true,
    }).exec();
  }

  async getAllAggregatorProduct(
    page: number,
    limit: number,
    aggregatorId: string,
    isPagination: string,
    categoryId: string,
    approvalStatusString: string,
    merchantIdString: string
  ): Promise<any> {
    const query: any = {};
    if (aggregatorId) {
      query.aggregatorId = aggregatorId;
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (approvalStatusString) {
      query.approved = approvalStatusString;
    }
    
    if (merchantIdString) {
      query.merchantId = new mongoose.Types.ObjectId(merchantIdString);
    }
    if (isPagination == "false") {
      const products = await AggregatorProduct.find(query)
        .populate("categoryId", "name")
        .populate("subCategoryId", "name")
        .exec();
        const formattedProducts = products.map(product => ({
          ...product.toObject(),
          categoryId: product.categoryId || {},
          subCategoryId: product.subCategoryId || {},
        }));
    
      return { products:formattedProducts, total: products.length };
    } else {
      const products = await AggregatorProduct.find(query)
        .populate("categoryId", "name")
        .populate("subCategoryId", "name")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
        const formattedProducts = products.map(product => ({
          ...product.toObject(),
          categoryId: product.categoryId || {},
          subCategoryId: product.subCategoryId || {},
        }));
    
      const total = await AggregatorProduct.countDocuments(query).exec();
      return { products:formattedProducts, total };
    }
  }

  async getAllAggregatorProductForAggregator(
    page: number,
    limit: number,
    aggregatorId: string,
    isPagination: string,
    categoryId: string,
    approvalStatusString: string
  ): Promise<any> {
    const query: any = {};
  
    if (aggregatorId) {
      query.aggregatorId = new mongoose.Types.ObjectId(aggregatorId);
    }
  
    if (categoryId) {
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        query.categoryId = new mongoose.Types.ObjectId(categoryId);
      } else {
        return {
          success: false,
          message: `Invalid categoryId: ${categoryId}`,
        };
      }
    }
  
    if (approvalStatusString) {
      query.approved = approvalStatusString;
    }
  
    try {
      const products = await AggregatorProduct.find(query)
        .populate('categoryId', 'name')
        .populate('subCategoryId', 'name')
        .exec();
  
      const formattedProducts = products.map(product => ({
        ...product.toObject(),
        categoryId: product.categoryId || {},
        subCategoryId: product.subCategoryId || {},
      }));
  
      const total = await AggregatorProduct.countDocuments(query).exec();
  
      return { products: formattedProducts, total };
    } catch (err) {
      console.error('Error retrieving products:', err);
      return { success: false };
    }
  }
  

  async approveProduct(
    productId: string
  ): Promise<AggregatorProductDoc | null> {
    return await AggregatorProduct.findByIdAndUpdate(
      productId,
      { approved: "completed" },
      { new: true }
    ).exec();
  }

  async rejectProduct(productId: string): Promise<AggregatorProductDoc | null> {
    return await AggregatorProduct.findByIdAndUpdate(
      productId,
      { approved: "rejected" },
      { new: true }
    ).exec();
  }

  async activeProduct(productId: string, isActive:boolean): Promise<AggregatorProductDoc | null> {
    return await AggregatorProduct.findByIdAndUpdate(
      productId,
      { isActive},
      { new: true, runValidators: true }
    ).exec();
  }



}

export const aggregatorProductRepository = new AggregatorProductRepository();
