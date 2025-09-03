import { CreateAddonMetaDataDTO, UpdateAddonMetaDataDTO } from '../dtos/addonMetaDataDTO';
import { AddonMetaDataRepository } from '../repositories/addonMetaData';

class AddonMetaDataService {
  private static addonMetaDataRepository = new AddonMetaDataRepository();

  static async createAddonMetaData(dto: CreateAddonMetaDataDTO) {
    return this.addonMetaDataRepository.createAddon(dto);
  }

  static async getAddonMetaDataById(id: string) {
    return this.addonMetaDataRepository.getAllAddonsById(id);
  }

  static async getAllAddonMetaData(merchantId:string) {
    return this.addonMetaDataRepository.getAllAddon(merchantId);
  }

  static async updateAddonMetaData(id: string, dto: UpdateAddonMetaDataDTO) {
    return this.addonMetaDataRepository.updateAddon(id, dto);
  }

  static async deleteAddonMetaData(id: string) {
    return this.addonMetaDataRepository.deleteAddon(id);
  }

}

export default AddonMetaDataService;
