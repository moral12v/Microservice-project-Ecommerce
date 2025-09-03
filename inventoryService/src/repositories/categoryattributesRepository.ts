import mongoose from "mongoose";
import CategoryAttributes,{CategoryAttributesDoc} from "../models/CategoryAttributes";

export class CategoryAttributeRepository {
  async createCategoryAttribute(attributeData: Partial<CategoryAttributesDoc>): Promise<CategoryAttributesDoc> {
    const categoryAttribute = new CategoryAttributes(attributeData);
    return await categoryAttribute.save();
  }
  
  async getCategoryAttributeById(attributeId: string): Promise<CategoryAttributesDoc | null> {
    return await CategoryAttributes.findById(attributeId).exec();
  }

  async updateCategoryAttribute(attributeId: string, updateData: Partial<CategoryAttributesDoc>): Promise<CategoryAttributesDoc | null> {
    return await CategoryAttributes.findByIdAndUpdate(attributeId, updateData, { new: true }).exec();
  }

  async deleteCategoryAttribute(attributeId: string): Promise<CategoryAttributesDoc | null> {
    return await CategoryAttributes.findByIdAndDelete(attributeId).exec();
  }

  async getAllCategoryAttributes(categoryIdString:string): Promise<CategoryAttributesDoc[]> {
    const query: any =  {}
    if(categoryIdString){
      query.categoryId = new mongoose.Types.ObjectId(categoryIdString);
    }
    return await CategoryAttributes.find(query).populate('categoryId').exec();
  }
  

  async getCategoryAttributesByCategoryId(categoryId: string): Promise<CategoryAttributesDoc[]> {
    return await CategoryAttributes.find({ categoryId }).exec();
  }
}

export const categoryAttributeRepository = new CategoryAttributeRepository();
