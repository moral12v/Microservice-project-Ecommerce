import ProductAddon, { ProductAddonDoc } from "../models/productAddon";

export class ProductAddonRepository {
  async createProductAddon(productAddonData: Partial<ProductAddonDoc>): Promise<ProductAddonDoc> {
    const productAddon = new ProductAddon(productAddonData);
    return await productAddon.save();
  }
  
  async getProductAddonById(productAddonId: string): Promise<ProductAddonDoc | null> {
    return await ProductAddon.findById(productAddonId)
      .populate('productId')
      .populate('categoryId')
      .populate('addonId')
      .exec();
  }

  async updateProductAddon(productAddonId: string, updateData: Partial<ProductAddonDoc>): Promise<ProductAddonDoc | null> {
    return await ProductAddon.findByIdAndUpdate(productAddonId, updateData, { new: true }).exec();
  }

  async deleteProductAddon(productAddonId: string): Promise<ProductAddonDoc | null> {
    return await ProductAddon.findByIdAndDelete(productAddonId).exec();
  }

  async getAllProductAddons(): Promise<ProductAddonDoc[]> {
    return await ProductAddon.find().exec();
  }
}
