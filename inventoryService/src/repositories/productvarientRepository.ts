import { CreateProductVarientDTO } from "../dtos/productVarientDTO";
import Productvarient,{ProductVarientDoc} from "../models/productvarient";

export class ProductvarientRepository {
  
  async createProductvarient(productvarientData: Partial<ProductVarientDoc>): Promise<ProductVarientDoc> {
    const productvarient = new Productvarient(productvarientData);
    return await productvarient.save();
  }

  async getProductvarientById(productvarientId: string): Promise<ProductVarientDoc | null> {
    return await Productvarient.findById(productvarientId).exec();
  }

  async updateProductvarient(productvarientId: string, updateData: Partial<ProductVarientDoc>): Promise<ProductVarientDoc | null> {
    return await Productvarient.findByIdAndUpdate(productvarientId, updateData, { new: true }).exec();
  }

  async deleteProductvarient(productvarientId: string): Promise<ProductVarientDoc | null> {
    return await Productvarient.findByIdAndDelete(productvarientId).exec();
  }

  async getAllProductvarient(): Promise<ProductVarientDoc[]> {
    return await Productvarient.find().exec();
  }

  async getProductvarientByCategory(categoryId: string): Promise<ProductVarientDoc[]> {
    return await Productvarient.find({ category_id: categoryId }).exec();
  }

  async getActiveProductvarient(): Promise<ProductVarientDoc[]> {
    return await Productvarient.find({ isactive: true }).exec();
  }
}

export const productvarientRepository = new ProductvarientRepository();
