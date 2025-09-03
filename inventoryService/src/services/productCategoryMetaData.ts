import { CreateProductCategoryMetaDataDTO, UpdateProductCategoryMetaDataDTOO } from '../dtos/productCategoryMetaDataDTO';
import { ProductCategoryMetaDataRepository } from '../repositories/productCategoryMetaDataRepository';

class ProductCategoryMetaDataService {
  private static productCategoryMetaDataRepository = new ProductCategoryMetaDataRepository();

  static async createProductCategoryMetaData(dto: any) {
    return this.productCategoryMetaDataRepository.createCategory(dto);
  }

  static async getProductCategoryMetaDataById(id: string) {
    return this.productCategoryMetaDataRepository.getAllCategoriesById(id);
  }

  static async getAllProductCategoryMetaData() {
    return this.productCategoryMetaDataRepository.getAllCategories();
  }

  static async updateProductCategoryMetaData(id: string, dto: any) {
    return this.productCategoryMetaDataRepository.updateCategory(id, dto);
  }

  static async deleteProductCategoryMetaData(id: string) {
    return this.productCategoryMetaDataRepository.deleteCategory(id);
  }

  
  static async getByMerchant(merchantId: string) {
    return this.productCategoryMetaDataRepository.getAllCategoriesByMerchant(merchantId);
  }

}

export default ProductCategoryMetaDataService;
