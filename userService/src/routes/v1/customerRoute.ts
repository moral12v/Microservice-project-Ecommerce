import express from 'express';
import * as customerController from '../../controllers/customerController';
import {
  loginOTPValidators,
  registercustomerValidators,
  resendOTPValidators,
  sendOTPValidators,
  verifyOTPValidators,
} from '../../validators/customerValidators';
import { validateRequest } from '../../middlewares/validateRequest';
import { customerAuthentication } from '../../middlewares/CustomerAuthentication';
export const customerRoutes = express.Router();
export const customerAuthRoute = express.Router();

customerRoutes.post(
  '/register',
  registercustomerValidators,
  validateRequest,
  customerController.registerCustomerHandler,
);
customerRoutes.get('/profile', customerAuthentication, customerController.getUsersProfileHandler);
customerRoutes.get('/', customerController.getAllCustomerHandler);
customerRoutes.post('/verify-otp', verifyOTPValidators, validateRequest, customerController.verifyOTPHandler);
customerRoutes.post('/resend-otp', resendOTPValidators, validateRequest, customerController.resendOTPHandler);
customerRoutes.post('/send-otp', sendOTPValidators, validateRequest, customerController.sendOTPHandler);
customerRoutes.post('/login-otp', loginOTPValidators, validateRequest, customerController.loginOTPHandler);
customerRoutes.delete('/delete-Account/', customerController.deleteAccountHandler);
customerRoutes.post('/update-device-token', customerAuthentication, customerController.updateCustomerDeviceId);
