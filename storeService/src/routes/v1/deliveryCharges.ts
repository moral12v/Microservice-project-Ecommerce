import express from 'express';
import { deliveryChargesController } from '../../controllers/DeliveryChargesController';
import { validateRequest } from '../../middlewares/validateRequest';
export const deliveryChargesRoute = express.Router();



deliveryChargesRoute.get('/get', validateRequest, deliveryChargesController.getAllDeliveryCharges);

deliveryChargesRoute.patch('/update/:id', validateRequest, deliveryChargesController.updateDeliveryCharges);