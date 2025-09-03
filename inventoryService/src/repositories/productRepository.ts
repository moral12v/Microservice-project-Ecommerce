import Product, { ProductDoc } from "../models/product";

export class ProductRepository {
  async createProduct(productData: Partial<ProductDoc>): Promise<ProductDoc> {
    const product = new Product(productData);
    return await product.save();
  }

  async getProductById(productId: string): Promise<ProductDoc | null> {
    return await Product.findById(productId).exec();
  }

  async updateProduct(productId: string, updateData: Partial<ProductDoc>): Promise<ProductDoc | null> {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true }).exec();
  }

  async deleteProduct(productId: string): Promise<ProductDoc | null> {
    return await Product.findByIdAndDelete(productId).exec();
  }

  async getAllProducts(): Promise<ProductDoc[]> {
    return await Product.find().exec();
  }

  async getProductsByCategory(categoryId: string): Promise<ProductDoc[]> {
    return await Product.find({ category_id: categoryId }).exec();
  }

  async getActiveProducts(): Promise<ProductDoc[]> {
    return await Product.find({ active: true }).exec();
  }

  async toggleProductStatus(productId: string, active: boolean): Promise<ProductDoc | null> {
    return await Product.findByIdAndUpdate(productId, { active }, { new: true }).exec();
  }

  async approveProductByAdmin(productId: string, approvedByAdmin: boolean): Promise<ProductDoc | null> {
    return await Product.findByIdAndUpdate(productId, { approvedByAdmin }, { new: true }).exec();
  }
}

export const productRepository = new ProductRepository();
