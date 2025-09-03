import { Request, Response } from 'express';
import { createBanner, getAllBanner, getBannerById, updateAddress, deleteAddress } from '../services/bannerService';
import { CreateBannerDTO, UpdateBannerDTO } from '../dtos/bannerDTO';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';

export const createBannerHandler = async (req: Request, res: Response) => {
  try {
    const bannerDto: CreateBannerDTO = req.body;
    const newBanner = await createBanner(bannerDto);
    responseWithData(res, 201, true, 'Banner created successfully.', newBanner);
  } catch (error: any) {
    logger.error(`Error creating Banner: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create Banner.');
  }
};

export const getAllBannersHandler = async (req: Request, res: Response) => {
  try {
    const banners = await getAllBanner();
    responseWithData(res, 200, true, 'banners retrieved successfully.', banners);
  } catch (error: any) {
    logger.error(`Error retrieving banners: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve banners.');
  }
};

export const getBannersByIdHandler = async (req: Request, res: Response) => {
  try {
    const bannerid = req.params.id;
    const banner = await getBannerById(bannerid);
    if (!banner) {
      return errorResponse(res, 'banner not found', 404);
    }
    responseWithData(res, 200, true, 'banner retrieved successfully', banner);
  } catch (error: any) {
    logger.error(`Error retrieving banner: ${error.message}`);
    errorResponse(res, error.message || 'banner to retrieve category.');
  }
};

export const updateBannerHandler = async (req: Request, res: Response) => {
  try {
    const bannerId = req.params.id;
    const bannerDto: UpdateBannerDTO = req.body;
    const updatedAddress = await updateAddress(bannerId, bannerDto);
    if (!updatedAddress) {
      return errorResponse(res, 'banner not found', 404);
    }
    responseWithData(res, 200, true, 'banner updated successfully', updatedAddress);
  } catch (error: any) {
    logger.error(`Error updating banner: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update banner.');
  }
};

export const deleteBannerHandler = async (req: Request, res: Response) => {
  try {
    const bannerId = req.params.id;
    await deleteAddress(bannerId);
    responseWithoutData(res, 200, true, 'banner deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting banner: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete banner.');
  }
};
