import express from 'express';
import * as mallController from "../../controllers/mallController";
import { registerMallValidators } from "../../validators/mallValidators"
import { validateRequest } from '../../middlewares/validateRequest';
export const mallRoute = express.Router();

mallRoute.post('/create', registerMallValidators, validateRequest, mallController.createMallController);
mallRoute.get('/', mallController.getAllMallsController);
mallRoute.get('/:mallId', mallController.getMallByIdController);
mallRoute.patch('/:mallId', mallController.updateMallController);
mallRoute.delete('/:mallId', mallController.deleteMallController);
mallRoute.get('/near-by/mall', mallController.getNearByStoreHandler);