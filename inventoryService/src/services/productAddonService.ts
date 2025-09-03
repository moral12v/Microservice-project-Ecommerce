import { CreateProductAddonDTO, UpdateProductAddonDTO } from '../dtos/productAddon';
import { ProductAddonRepository } from '../repositories/productAddonRepository';

class ProductAddonService {
  private static productAddonRepository = new ProductAddonRepository();

  static async createProductAddon(dto: CreateProductAddonDTO) {
    return this.productAddonRepository.createProductAddon(dto);
  }

  static async getProductAddonById(id: string) {
    return this.productAddonRepository.getProductAddonById(id);
  }

  static async getAllProductAddons() {
    return this.productAddonRepository.getAllProductAddons();
  }

  static async updateProductAddon(id: string, dto: UpdateProductAddonDTO) {
    return this.productAddonRepository.updateProductAddon(id, dto);
  }

  static async deleteProductAddon(id: string) {
    return this.productAddonRepository.deleteProductAddon(id);
  }
}

export default ProductAddonService;
