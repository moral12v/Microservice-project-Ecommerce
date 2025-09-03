import ProductCategoryMetaData,{ProductCategoryMetaDataDoc} from "../models/productCategoryMetaData";

export class ProductCategoryMetaDataRepository {
  async createCategory(categoryData: Partial<ProductCategoryMetaDataDoc>): Promise<ProductCategoryMetaDataDoc> {
    const category = new ProductCategoryMetaData(categoryData);
    return await category.save();
  }

  async updateCategory(categoryId: string,updateData: Partial<ProductCategoryMetaDataDoc>): Promise<ProductCategoryMetaDataDoc | null> {
    return await ProductCategoryMetaData.findByIdAndUpdate(categoryId, updateData, { new: true }).exec();
  }

  async deleteCategory(categoryId: string): Promise<ProductCategoryMetaDataDoc | null> {
    return await ProductCategoryMetaData.findByIdAndDelete(categoryId).exec();
  }

  async getAllCategories(): Promise<ProductCategoryMetaDataDoc[]> {
    return await ProductCategoryMetaData.find().exec();
  }

  async getAllCategoriesById(categoryId: string): Promise<ProductCategoryMetaDataDoc| null > {
    return await ProductCategoryMetaData.findById(categoryId).exec();
  }
  

  async getAllCategoriesByMerchant(merchantId: string): Promise<ProductCategoryMetaDataDoc[] | null> { 
    return await ProductCategoryMetaData.find({ merchantId }).populate('products').exec();
  }
}

export const productCategoryMetaDataRepository = new ProductCategoryMetaDataRepository();
