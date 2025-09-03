import express from 'express';
import * as bannerController from '../../controllers/bannerController';
import { validateRequest } from '../../middlewares/validateRequest';
export const bannerRoute = express.Router();

bannerRoute.post('/', validateRequest, bannerController.createBannerHandler);
bannerRoute.get('/:id', bannerController.getBannersByIdHandler);
bannerRoute.get('/', bannerController.getAllBannersHandler);
bannerRoute.patch('/:id', bannerController.updateBannerHandler);
bannerRoute.delete('/:id', bannerController.deleteBannerHandler);
