import { Request, Response } from 'express';
import { CreateAdminDTO } from '../dtos/AdminDTO';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';
import {
  checkPassword,
  createAdmin,
  getAdminByEmail,
  getAdminById,
  getAllAdmins,
  resendOTP,
  updateAdminPassword,
  verifyOTP,
} from '../services/adminService';
import { generateAccessToken, generateRefreshToken } from '../services/jwtServices';
import { createOrUpdateAdminAccessToken, deleteAdminAccessToken } from '../services/AdminAccessTokenService';
import { Types } from 'mongoose';

export const registerAdminHandler = async (req: Request, res: Response) => {
  try {
    const adminDto: CreateAdminDTO = req.body;
    const newAdmin = await createAdmin(adminDto);
    responseWithoutData(res, 201, true, 'Admin created successfully');
    logger.info(`Admin created: ${newAdmin}`);
  } catch (error: any) {
    logger.error(`Error creating Admin: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create Admin.');
  }
};

export const getAllAdminHandler = async (req: Request, res: Response) => {
  try {
    const admins = await getAllAdmins();
    responseWithData(res, 200, true, 'admins retrieved successfully', admins);
  } catch (error: any) {
    logger.error(`Error retrieving admin: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve admin.');
  }
};

export const getAdminByIdHandler = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const admin = await getAdminById(adminId);
    if (!admin) {
      return errorResponse(res, 'admin not found', 404);
    }
    responseWithData(res, 200, true, 'admin retrieved successfully', admin);
  } catch (error: any) {
    logger.error(`Error retrieving admin: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve admin.');
  }
};

export const updateAdminPasswordHandler = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    const passwordDto: CreateAdminDTO = req.body;
    await updateAdminPassword(vendorId, passwordDto);
    responseWithoutData(res, 200, true, 'Password updated successfully');
  } catch (error: any) {
    logger.error(`Error updating password: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update password.');
  }
};

export const verifyOTPHandler = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const { otp } = req.body;
    const isVerified = await verifyOTP(adminId, otp);
    if (!isVerified) {
      return errorResponse(res, 'Invalid or expired OTP', 400);
    }
    responseWithoutData(res, 200, true, 'OTP verified successfully');
  } catch (error: any) {
    logger.error(`Error verifying OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to verify OTP.');
  }
};

export const resendOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const resendResult = await resendOTP(mobile);
    if (!resendResult.success) {
      return errorResponse(res, resendResult.message, 400);
    }
    return responseWithoutData(res, 200, true, resendResult.message);
  } catch (error: any) {
    logger.error(`Error resending OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to resend OTP.');
  }
};

export const adminLoginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await getAdminByEmail(email);
    if (!admin) {
      responseWithoutData(res, 404, false, 'Admin not found');
    } else {
      const passwordMatch = await checkPassword(email, password);
      if (!passwordMatch) {
        responseWithoutData(res, 401, false, 'Invalid credentials');
      } else {
        const accessToken = generateAccessToken(admin._id.toString());
        const refreshToken = generateRefreshToken(admin.toString);
        const device: any = req.headers['x-device'] || 'Unknown';
        const ip = req.ip || 'Unknown';
        const adminId = admin?._id;
        const token = await createOrUpdateAdminAccessToken(adminId, device, ip, accessToken, refreshToken);
        responseWithData(res, 200, true, 'Login Successful', token);
      }
    }
  } catch (error: any) {
    console.error(`Error during admin login: ${error.message}`);
    errorResponse(res, error.message || 'Failed to log in.');
  }
};

export const adminLogoutHandler = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const adminId = req.params.adminId;

    if (!Types.ObjectId.isValid(adminId)) {
      return responseWithoutData(res, 400, false, 'Invalid admin ID');
    }

    await deleteAdminAccessToken(new Types.ObjectId(adminId), accessToken);

    responseWithoutData(res, 200, true, 'Logout Successful');
  } catch (error: any) {
    console.error(`Error during admin logout: ${error.message}`);
    errorResponse(res, error.message || 'Failed to log out.');
  }
};
