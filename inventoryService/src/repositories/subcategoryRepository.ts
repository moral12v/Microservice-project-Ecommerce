import Subcategory, { SubcategoryDoc } from '../models/subcategory'

export class SubcategoryRepository {
  async createSubcategory(subcategoryData: Partial<SubcategoryDoc>): Promise<SubcategoryDoc> {
    const subcategory = new Subcategory(subcategoryData);
    return await subcategory.save();
  }

  async getSubcategoryById(subcategoryId: string): Promise<SubcategoryDoc | null> {
    return await Subcategory.findById(subcategoryId).exec();
  }

  async updateSubcategory(subcategoryId: string, updateData: Partial<SubcategoryDoc>): Promise<SubcategoryDoc | null> {
    return await Subcategory.findByIdAndUpdate(subcategoryId, updateData, { new: true }).exec();
  }

  async deleteSubcategory(subcategoryId: string): Promise<SubcategoryDoc | null> {
    return await Subcategory.findByIdAndDelete(subcategoryId).exec();
  }

  async getAllSubcategories(categoryId: string): Promise<SubcategoryDoc[]> {
    const query:any= {};
    if (categoryId) {
      query.categoryId = categoryId;
    }
    return await Subcategory.find(query).exec();
  }

  async getSubcategoriesByCategoryId(categoryId: string): Promise<SubcategoryDoc[]> {
    return await Subcategory.find({ categoryId }).exec();
  }

}

export const subcategoryRepository = new SubcategoryRepository();
