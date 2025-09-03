import Banner, {BannerDoc} from "../models/banner"

export class BannerRepository{
    async createBanner(bannerData: Partial<BannerDoc>): Promise<BannerDoc>{
        const banner = new Banner(bannerData);
        return await banner.save();
    }
   
    async getAllBanners(query: any): Promise<BannerDoc[]> {
        return await Banner.find(query).exec();
    }
      

    async updateBanner(bannerId: string, updateData: Partial<BannerDoc>): Promise<BannerDoc | null>{
        return await Banner.findByIdAndUpdate(bannerId,updateData,{new: true}).exec();
    }

    async deleteBanner(bannerId: string): Promise<BannerDoc | null>{
        return await Banner.findByIdAndDelete(bannerId).exec();
    }

    async deleteBannerField(bannerId: string, field: string): Promise<BannerDoc | null> {
        const update = { $unset: { [field]: "" } };
        return await Banner.findByIdAndUpdate(bannerId, update, { new: true }).exec();
    }

}




export const bannerRepository = new BannerRepository();