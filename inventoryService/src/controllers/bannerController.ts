import { Request, Response } from 'express';
import { createBanner, getAllBanners, updateBanner, deleteBanner, deleteBannerField, } from '../services/bannerService';
import { createBannerDTO, updateBannerDTO } from '../dtos/bannerDTO';
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from '../utils/response';
import logger from '../utils/logger';


export const createBannerHandler = async (req: Request, res: Response) => {
  try {
    const bannerDto: createBannerDTO = req.body;
    const newBanner = await createBanner(bannerDto);
    responseWithData(res, 201, true, 'Banner created successfully.', newBanner);
  } catch (error: any) {
    logger.error(`Error retrieving Banner: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve Banner.');
  }
}


export const getAllBannersHandler = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      showInApp
    } = req.query;
    const showInAppBoolean = showInApp === 'true';
    const query: any = {};
    if (categoryId) {
      query.categoryId = categoryId as string;
    }
    if (showInApp !== undefined) {
      query.showInApp = showInAppBoolean;
    }
    const banners = await getAllBanners(query);
    responseWithData(res, 200, true, 'Banners retrieved successfully', banners);
  } catch (error: any) {
    logger.error(`Error retrieving Banners: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve Banners.');
  }
};

export const updateBannerHandler = async (req: Request, res: Response) => {
  try {
    const bannerId = req.params.id;
    const bannerDTO: updateBannerDTO = req.body;
    const updatedbanner = await updateBanner(bannerId, bannerDTO);
    if (!updatedbanner) {
      return errorResponse(res, 'Banner not found', 404);
    }
    responseWithData(res, 200, true, 'Banner updated successfully', updatedbanner);
  } catch (error: any) {
    logger.error(`Error updating Banner: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update Banner.');
  }
}


export const deleteBannerHandler = async (req: Request, res: Response) => {
  try {
    const bannerId = req.params.id;
    const { webBannerUrl, appBannerUrl } = req.query;

    if (webBannerUrl) {
      await deleteBannerField(bannerId, 'webBannerUrl');
      return responseWithoutData(res, 200, true, 'webBannerUrl deleted successfully');
    }

    if (appBannerUrl) {
      await deleteBannerField(bannerId, 'appBannerUrl');
      return responseWithoutData(res, 200, true, 'appBannerUrl deleted successfully');
    }

    return errorResponse(res, 'No valid field to delete provided', 400);
  } catch (error: any) {
    logger.error(`Error deleting field from Banner: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete field from Banner.');
  }
};