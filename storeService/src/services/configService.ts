import { CreateConfigDTO, UpdateConfigDTO } from "../dtos/configDTO";
import { ConfigDocument } from "../models/configModel";
import { configRepository } from "../repositories/configRepository";

class ConfigService {
    async createConfig(data: CreateConfigDTO): Promise<any> {
        const existingConfig = await configRepository.getConfigByModelKey(data.modelKey);
        
        if (existingConfig) {
            const updatedConfig= {
                ...existingConfig.toObject(),
                sortConfigs: [
                    ...existingConfig.sortConfigs,
                    ...data.sortConfigs.filter(
                        newSort => !existingConfig.sortConfigs.some(existingSort => existingSort.key === newSort.key)
                    )
                ],
                filterConfigs: [
                    ...existingConfig.filterConfigs,
                    ...data.filterConfigs.filter(
                        newFilter => !existingConfig.filterConfigs.some(existingFilter => existingFilter.key === newFilter.key)
                    )
                ]
            };
            return await configRepository.updateConfig(existingConfig._id, updatedConfig);
        } else {
            const newConfig = await configRepository.createConfig(data as Partial<ConfigDocument>);
            if (!newConfig) {
                throw new Error("Failed to create new configuration.");
            }
            return newConfig;
        }
    }
    

  async getAllConfigs(): Promise<ConfigDocument[]> {
    return await configRepository.getAllConfigs();
  }

  async getConfigById(configId: string): Promise<ConfigDocument | null> {
    return await configRepository.getConfigById(configId);
  }

  async updateConfig(
    configId: string,
    updateData: UpdateConfigDTO
  ): Promise<ConfigDocument | null> {
    return await configRepository.updateConfig(
      configId,
      updateData as Partial<ConfigDocument>
    );
  }

  async deleteConfig(configId: string): Promise<ConfigDocument | null> {
    return await configRepository.deleteConfig(configId);
  }

  async getLatestConfig(): Promise<ConfigDocument | null> {
    return await configRepository.getLatestConfig();
  }

  async getConfigByModelKey(modelKey: string): Promise<ConfigDocument | null> {
    return await configRepository.getConfigByModelKey(modelKey);
  }
}

export const configService = new ConfigService();
