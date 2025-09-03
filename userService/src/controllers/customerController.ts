import { Request, Response } from 'express';
import { CreateCustomerDTO } from '../dtos/CustomerDTO';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';
import {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  getCustomerMobile,
  resendOTP,
  verifyOTP,
  deleteAccount,
  sendOtp,
  updateDeviceId,
} from '../services/customerService';
import { generateAccessToken, generateRefreshToken } from '../services/jwtServices';
import { createOrUpdateCustomerAccessToken } from '../services/customerAccessTokenService';
import { authValues, TokenUserProfile } from '../utils/customerAuthValues';

export const registerCustomerHandler = async (req: Request, res: Response) => {
  try {
    const customerDto: CreateCustomerDTO = req.body;
    const newCustomer = await createCustomer(customerDto);
    responseWithoutData(res, 201, true, 'Customer updated successfully');
    logger.info(`Customer updated: ${newCustomer}`);
  } catch (error: any) {
    logger.error(`Error updating Customer: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update Customer.');
  }
};

export const getAllCustomerHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isPagination = (req.query.isPagination as string) || 'true';

    const { customers, total } = await getAllCustomer(page, limit, isPagination);

    responseWithData(res, 200, true, 'Customers retrieved successfully', {
      customers,
      page: isPagination === 'true' ? page : undefined,
      limit: isPagination === 'true' ? limit : undefined,
      total,
      isPagination,
    });
  } catch (error: any) {
    logger.error(`Error retrieving customers: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve customers.');
  }
};

export const getcustomerByIdHandler = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return errorResponse(res, 'customer not found', 404);
    }
    responseWithData(res, 200, true, 'admin retrieved successfully', customer);
  } catch (error: any) {
    logger.error(`Error retrieving admin: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve customer.');
  }
};

export const verifyOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;
    const result = await verifyOTP(mobile, otp);
    if (!result.success) {
      return errorResponse(res, result.message, 400);
    }
    return responseWithoutData(res, 200, true, result.message);
  } catch (error: any) {
    logger.error(`Error verifying OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to verify OTP.');
  }
};

export const resendOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const result = await resendOTP(mobile);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
      isRecentlyCreated: result.isRecentlyCreated,
    });
  } catch (error: any) {
    logger.error(`Error resending OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to resend OTP.');
  }
};

export const sendOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const result = await sendOtp(mobile);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
      isRecentlyCreated: result.isRecentlyCreated,
    });
  } catch (error: any) {
    logger.error(`Error sending OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to send OTP.');
  }
};

export const loginOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;
    const customer = await getCustomerMobile(mobile);
    if (!customer) {
      responseWithoutData(res, 404, false, 'Customer not found');
    } else {
      const result = await verifyOTP(mobile, otp);
      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }
      const accessToken = generateAccessToken(customer._id);
      const refreshToken = generateRefreshToken(customer._id);
      const device: any = req.headers['x-device'] || 'Unknown';
      const ip = req.ip || 'Unknown';
      const customerId = customer?._id;
      const token = await createOrUpdateCustomerAccessToken(customerId, device, ip, accessToken, refreshToken);
      let signupRequired = false;
      if (!customer.email && !customer?.fullName) {
        signupRequired = true;
      }
      responseWithData(res, 200, true, 'Login Successful', { token, signupRequired });
    }
  } catch (error: any) {
    logger.error(`Error Login: ${error.message}`);
    errorResponse(res, error.message || 'Failed to login user');
  }
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isPagination = (req.query.isPagination as string) || 'true';

    const { customers, total } = await getAllCustomer(page, limit, isPagination);

    responseWithData(res, 200, true, 'Customers retrieved successfully', {
      customers,
      page: isPagination === 'true' ? page : 0,
      limit: isPagination === 'true' ? limit : 0,
      total,
      isPagination,
    });
  } catch (error: any) {
    logger.error(`Error retrieving customers: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve customers.');
  }
};

export const getUsersProfileHandler = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }

    const customerId: any = await TokenUserProfile(token);
    
    if (!customerId) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }

    let signupRequired = !customerId.email && !customerId.fullName;

    // Create the response object with user data and signupRequired flag
    const userProfile = {
      email: customerId.email,
      _id: customerId._id,
      fullName: customerId.fullName,
      mobile: customerId.mobile,
      language: customerId.language,
      verified: customerId.verified,
      isActive: customerId.isActive,
      createdAt: customerId.createdAt,
      updatedAt: customerId.updatedAt,
      isdeleted: customerId.isdeleted,
      isRecentlyCreated: customerId.isRecentlyCreated,
      deviceId: customerId.deviceId,
      signupRequired: signupRequired
    };

    responseWithData(res, 200, true, 'Users retrieved successfully', userProfile);
  } catch (error: any) {
    logger.error(`Error retrieving users: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve users.');
  }
};


export const deleteAccountHandler = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }

    const customerId: any = await TokenUserProfile(token);

    if (!customerId) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    const deleted = await deleteAccount(customerId);

    if (!deleted) {
      return errorResponse(res, 'Customer not found or account already deleted', 404);
    }

    responseWithoutData(res, 200, true, 'Customer account deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting customer account: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete customer account.');
  }
};

export const updateCustomerDeviceId = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'] as string;
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }

    const customer: any = await TokenUserProfile(token);
    if (!customer) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    const { deviceId } = req.body;
    if (!deviceId) {
      return responseWithoutData(res, 400, false, 'Device ID is required');
    }
    const updatedUser = await updateDeviceId(customer._id, deviceId);
    if (!updatedUser) {
      return responseWithoutData(res, 404, false, 'User not found');
    }
    return responseWithoutData(res, 200, true, 'Device Token has been Updated Successfully!');
  } catch (error: any) {
    logger.error(`Error updating deviceId: ${error.message}`);
    errorResponse(res, error.message || 'Internal Server Error.');
  }
};
