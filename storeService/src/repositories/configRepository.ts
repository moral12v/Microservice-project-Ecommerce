import Config, { ConfigDocument } from "../models/configModel"; 

class ConfigRepository {
  async createConfig(data: Partial<ConfigDocument>): Promise<ConfigDocument> {
    const config = new Config(data);
    return await config.save();
  }

  async updateConfig(configId: string, updateData: Partial<ConfigDocument>): Promise<ConfigDocument | null> {
    return await Config.findByIdAndUpdate(configId, updateData, { new: true }).exec();
  }

  async deleteConfig(configId: string): Promise<ConfigDocument | null> {
    return await Config.findByIdAndDelete(configId).exec();
  }

  async getAllConfigs(): Promise<ConfigDocument[]> {
    return await Config.find().exec();
  }

  async getConfigById(configId: string): Promise<ConfigDocument | null> {
    return await Config.findById(configId).exec();
  }

  async getLatestConfig(): Promise<ConfigDocument | null> {
    return await Config.findOne().sort({ createdAt: -1 }).exec();
  }
  async getConfigByModelKey(modelKey: string): Promise<ConfigDocument | null> {
    return await Config.findOne({ modelKey }).exec();
  }
}

export const configRepository = new ConfigRepository();
