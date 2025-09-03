import { BannerDoc } from '../models/Banner';
import { bannerRepository } from '../repositories/bannerRepository';
import { CreateBannerDTO, UpdateBannerDTO } from '../dtos/bannerDTO';

export const createBanner = async (bannerDto: CreateBannerDTO): Promise<BannerDoc> => {
  return await bannerRepository.createBanner(bannerDto);
};

export const getAllBanner = async (): Promise<BannerDoc[]> => {
  return await bannerRepository.getAllABanner();
};

export const getBannerById = async (bannerId: string): Promise<BannerDoc | null> => {
  return await bannerRepository.getBannerById(bannerId);
};

export const updateAddress = async (bannerId: string, bannerDto: UpdateBannerDTO): Promise<BannerDoc | null> => {
  return await bannerRepository.updateBanner(bannerId, bannerDto);
};

export const deleteAddress = async (bannerId: string): Promise<void> => {
  await bannerRepository.deleteBanner(bannerId);
};
