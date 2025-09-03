import express from 'express';

import { validateRequest } from '../../middlewares/validateRequest';

import { customerAuthentication } from '../../middlewares/validateUser';
import checkoutController from '../../controllers/checkoutController';
export const checkoutRoute = express.Router();



checkoutRoute.post('/', customerAuthentication, validateRequest, checkoutController.handleCheckout);



