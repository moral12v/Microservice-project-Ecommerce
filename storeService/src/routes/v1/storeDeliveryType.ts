import express from 'express';
import * as storeDeliveryTypeController from "../../controllers/storeDeliveryTypeController"
import { registerStoreValidators } from '../../validators/storeValidator';
import { validateRequest } from '../../middlewares/validateRequest';
export const storeDeliveryTypeRoute = express.Router();



storeDeliveryTypeRoute.post('/create',registerStoreValidators, validateRequest, storeDeliveryTypeController.createDeliveryType);
storeDeliveryTypeRoute.get('/', storeDeliveryTypeController.getAllDeliveryTypes);
storeDeliveryTypeRoute.get('/:id', storeDeliveryTypeController.getDeliveryTypeById);
storeDeliveryTypeRoute.put('/:id', storeDeliveryTypeController.updateDeliveryType);
storeDeliveryTypeRoute.delete('/:id', storeDeliveryTypeController.deleteDeliveryType);


