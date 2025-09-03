import { CreateAddonDTO, UpdateAddonDTO } from '../dtos/AddonDTO';
import { AddonRepository } from '../repositories/addonRepository';

class AddonService {
  private static addonRepository = new AddonRepository();

  static async createAddon(dto: CreateAddonDTO) {
    return this.addonRepository.createAddon(dto);
  }

  static async getAddonById(id: string) {
    return this.addonRepository.getAddonById(id);
  }

  static async getAllAddons(available: boolean | undefined) {
    return this.addonRepository.getAllAddons();
  }

  static async updateAddon(id: string, dto: UpdateAddonDTO) {
    return this.addonRepository.updateAddon(id, dto);
  }

  static async deleteAddon(id: string) {
    return this.addonRepository.deleteAddon(id);
  }
}

export default AddonService;
