import express, { Router } from 'express';
import * as vendorController from '../../controllers/vendorController';
import {
  loginOTPValidators,
  registervendorValidators,
  sendOTPValidators,
  updateVendorAddressValidators,
  updateVendorAdminAddressValidators,
  updateVendorAdminValidators,
  updateVendorValidators,
} from '../../validators/vendorValidators';
import { validateRequest } from '../../middlewares/validateRequest';
import { vendorAuthentication } from '../../middlewares/vendorAunthetication';
import { AdminAuthentication } from '../../middlewares/AdminAunthetication';
import { vendorQueryAuthentication } from '../../middlewares/vendorQuery';
export const vendorRoute = express.Router();
export const vendorAuthRoute = express.Router();

// *********************
// vendor Routes
// *********************

vendorRoute.get('/profile', vendorAuthentication, vendorController.getVendorProfileHandler);
vendorRoute.post('/register', registervendorValidators, validateRequest, vendorController.registerVendorHandler);
vendorRoute.get('/:id', vendorController.getVendorByIdHandler);
vendorRoute.get('/', vendorController.getVendorsWithPaginationHandler);
vendorRoute.get('/profile', vendorAuthentication, vendorController.getVendorProfileHandler);
vendorRoute.put('/:id/update-password', vendorController.updateVendorPasswordHandler);
vendorRoute.post('/verify-otp', vendorController.verifyOTPHandler);
vendorRoute.post('/resend-otp', vendorController.resendOTPHandler);
vendorRoute.post('/login', vendorController.vendorLoginHandler);
vendorRoute.patch('/vendors/:id/updateActiveStatus', vendorController.updateActiveStatus);
vendorRoute.patch(
  '/update/profile',
  vendorAuthentication,
  updateVendorValidators,
  validateRequest,
  vendorController.updatePersonalDetails,
);
vendorRoute.patch(
  '/update/address',
  vendorAuthentication,
  updateVendorAddressValidators,
  validateRequest,
  vendorController.updateAddress,
);
vendorRoute.post('/send-otp', sendOTPValidators, validateRequest, vendorController.sendOTPHandler);
vendorRoute.post('/login-otp', loginOTPValidators, validateRequest, vendorController.loginOTPHandler);
vendorRoute.post('/forgot-password', validateRequest, vendorController.forgotPasswordHandler);
vendorRoute.post('/change-password', validateRequest, vendorController.changePasswordHandler);
vendorRoute.post('/update-password', validateRequest, vendorController.updatePasswordHandler);
vendorRoute.patch(
  '/update/details',
  vendorQueryAuthentication,
  updateVendorValidators,
  validateRequest,
  vendorController.updatePersonalDetailsV2,
);

// *********************
// ADMIN ROUTES
// *********************

vendorRoute.patch('/admin/approve/:id', AdminAuthentication, vendorController.approveVendorHandler);
vendorRoute.patch('/admin/reject/:id', AdminAuthentication, vendorController.rejectVendorHandler);
vendorRoute.post('/admin/verify-otp', AdminAuthentication, vendorController.verifyOTPForAdminHandler);
vendorRoute.patch(
  '/admin/update/profile',
  AdminAuthentication,
  updateVendorAdminValidators,
  validateRequest,
  vendorController.updatePersonalDetailsForAdmin,
);
vendorRoute.patch(
  '/admin/update/address',
  AdminAuthentication,
  updateVendorAdminAddressValidators,
  validateRequest,
  vendorController.updateAddressForAdmin,
);
vendorRoute.delete('/admin/:id', AdminAuthentication, vendorController.deleteVendorHandler);

/////Bank Route///////////////

vendorRoute.post('/Bank', vendorAuthentication, vendorController.registerBankHandler);
vendorRoute.post('/admin/Bank', vendorController.registerBankForAdminHandler);
