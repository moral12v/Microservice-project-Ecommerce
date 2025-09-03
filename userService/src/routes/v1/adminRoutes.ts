import express from 'express';
import * as adminController from '../../controllers/adminController';
import { registeradminValidators } from '../../validators/adminValidators';
import { validateRequest } from '../../middlewares/validateRequest';
export const adminRoute = express.Router();
export const adminAuthRoute = express.Router();

adminRoute.post('/register', registeradminValidators, validateRequest, adminController.registerAdminHandler);
adminRoute.get('/:id', adminController.getAdminByIdHandler);
adminRoute.get('/', adminController.getAllAdminHandler);
adminRoute.put('/:id/update-password', adminController.updateAdminPasswordHandler);
adminRoute.post('/:id/verify-otp', adminController.verifyOTPHandler);
adminRoute.post('/login', adminController.adminLoginHandler);
adminAuthRoute.post('/logout', adminController.adminLogoutHandler);
