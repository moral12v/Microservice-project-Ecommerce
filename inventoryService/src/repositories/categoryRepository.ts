import { Types } from "mongoose";
import Category, { CategoryDoc } from "../models/category"

export class CategoryRepository {
  async createCategory(categoryData: Partial<CategoryDoc>): Promise<CategoryDoc> {
    const category = new Category(categoryData);
    return await category.save();
  }
  
  async getCategoryById(categoryId: string): Promise<CategoryDoc | null> {
    return await Category.findById(categoryId).exec();
  }

  async updateCategory(categoryId: string, updateData: Partial<CategoryDoc>): Promise<CategoryDoc | null> {
    return await Category.findByIdAndUpdate(categoryId, updateData, { new: true }).exec();
  }

  async deleteCategory(categoryId: string): Promise<CategoryDoc | null> {
    return await Category.findByIdAndDelete(categoryId).exec();
  }

  async getAllCategories(): Promise<CategoryDoc[]> {
    return await Category.find().exec();
  }
  async getAllCategorieForUser(): Promise<CategoryDoc[]> {
    return await Category.find({ _id: { $ne: new Types.ObjectId("668e676ab4703b6bc91b18f7") } }).exec();
  }
}

export const categoryRepository = new CategoryRepository();


  

