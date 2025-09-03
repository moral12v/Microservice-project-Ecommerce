import { BannerDoc } from 'src/models/banner';
import { bannerRepository } from '../repositories/bannerRepository';
import { createBannerDTO, updateBannerDTO } from '../dtos/bannerDTO';


export const createBanner = async (bannerDto: createBannerDTO): Promise<BannerDoc>=>{
    return await bannerRepository.createBanner(bannerDto)
}

export const getAllBanners = async (query: any): Promise<BannerDoc[]> => {
    return await bannerRepository.getAllBanners(query);
  }

export const deleteBanner = async(bannerId : string): Promise<BannerDoc| null>=>{
    return await bannerRepository.deleteBanner(bannerId);
}

export const updateBanner = async(bannerId : string, bannerDTO: updateBannerDTO): Promise<BannerDoc | null>=>{
    return await bannerRepository.updateBanner(bannerId, bannerDTO)
    
}

export const deleteBannerField = async (bannerId: string, field: string): Promise<BannerDoc | null> => {
    return await bannerRepository.deleteBannerField(bannerId, field);
}