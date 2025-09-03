import express from 'express';
import * as deliveryTypeController from "../../controllers/deliveryTypeController";


export const deliveryTypeRoute = express.Router();


deliveryTypeRoute.post('/', deliveryTypeController.createDeliveryTypeHandler );
deliveryTypeRoute.get('/', deliveryTypeController.getAllDeliveryTypeHandler );
deliveryTypeRoute.get('/:id', deliveryTypeController.getDeliveryTypeByIdHandler );
deliveryTypeRoute.patch('/:id', deliveryTypeController.updateDeliveryTypeHandler );


