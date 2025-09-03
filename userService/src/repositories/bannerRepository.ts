import Banner, { BannerDoc } from '../models/Banner';

export default class BannerRepository {
  async createBanner(bannerData: Partial<BannerDoc>): Promise<BannerDoc> {
    const banner = new Banner(bannerData);
    return await banner.save();
  }

  async getBannerById(bannerId: string): Promise<BannerDoc | null> {
    return await Banner.findById(bannerId).exec();
  }

  async updateBanner(bannerId: string, updateData: Partial<BannerDoc>): Promise<BannerDoc | null> {
    return await Banner.findByIdAndUpdate(bannerId, updateData, { new: true }).exec();
  }

  async deleteBanner(bannerId: string): Promise<BannerDoc | null> {
    return await Banner.findByIdAndDelete(bannerId).exec();
  }

  async getAllABanner(): Promise<BannerDoc[]> {
    return await Banner.find({}).exec();
  }
}
export const bannerRepository = new BannerRepository();
