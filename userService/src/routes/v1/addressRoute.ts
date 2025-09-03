import express from 'express';
import * as addressController from '../../controllers/addressController';
import { validateRequest } from '../../middlewares/validateRequest';
import { customerAuthentication } from '../../middlewares/CustomerAuthentication';
import { registerAddressValidators } from '../../validators/addressValidators';
export const addressRoute = express.Router();

addressRoute.post(
  '/',
  registerAddressValidators,
  validateRequest,
  customerAuthentication,
  addressController.createAddressHandler,
);
addressRoute.get('/', customerAuthentication, addressController.getAllCustomerAddressesHandler);
addressRoute.get('/:id', addressController.getAddressByIdHandler);
addressRoute.patch('/:id', customerAuthentication, addressController.updateAddressHandler);
addressRoute.delete('/:id', customerAuthentication, addressController.deleteAddressHandler);
