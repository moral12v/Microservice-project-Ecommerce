import { Request, Response } from 'express';
import {
  approveVendor,
  checkPassword,
  createBank,
  createVendor,
  DeleteVendor,
  forgotPassword,
  getAllVendors,
  getVendorById,
  getvendorMobile,
  getVendorsWithPagination,
  rejectVendor,
  resendOTP,
  resetPassword,
  updatePassword,
  updateVendorAddressService,
  updateVendorPassword,
  updateVendorPersonalDetailsService,
  verifyOTP,
  verifyOTPForAdmin,
} from '../services/vendorService';
import { CreateBankDTO, CreateVendorDTO } from '../dtos/VendorDTO';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';
import { generateAccessToken, generateRefreshToken } from '../services/jwtServices';
import { createOrUpdateVendorAccessToken } from '../services/vendorAccessTokenService';
import Vendor, { ApprovalStatus } from '../models/Vendor';
import { TokenUserId, TokenVendorProfile } from '../utils/vendorAuthValues';

export const registerVendorHandler = async (req: Request, res: Response) => {
  try {
    const vendorDto: CreateVendorDTO = req.body;
    const newVendor = await createVendor(vendorDto);
    responseWithData(res, 201, true, 'Vendor created successfully. OTP sent.',newVendor);
    logger.info(`Vendor created: ${newVendor}`);
  } catch (error: any) {
    logger.error(`Error creating vendor: ${error.message}`);
    errorResponse(res, error.message || 'Failed to create vendor.');
  }
};

export const getVendorsWithPaginationHandler = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 5, approvalStatus = '', isPagination = true } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const approvalStatusString = approvalStatus as string;
    const pagination = isPagination as string;

    const result = await getVendorsWithPagination(pageNumber, limitNumber, approvalStatusString, pagination);

    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: result.total,
      vendors: result.vendors,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error(`Error retrieving vendors with pagination: ${error.message}`);
    res.status(500).json({
      message: 'Failed to retrieve vendors',
    });
  }
};

export const getVendorByIdHandler = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    const vendor = await getVendorById(vendorId);
    if (!vendor) {
      return errorResponse(res, 'Vendor not found', 404);
    }
    responseWithData(res, 200, true, 'Vendor retrieved successfully', vendor);
  } catch (error: any) {
    logger.error(`Error retrieving vendor: ${error.message}`);
    errorResponse(res, error.message || 'Failed to retrieve vendor.');
  }
};

export const updateVendorPasswordHandler = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    const passwordDto: CreateVendorDTO = req.body;
    await updateVendorPassword(vendorId, passwordDto);
    responseWithoutData(res, 200, true, 'Password updated successfully');
  } catch (error: any) {
    logger.error(`Error updating password: ${error.message}`);
    errorResponse(res, error.message || 'Failed to update password.');
  }
};

export const deleteVendorHandler = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    await DeleteVendor(vendorId);
    responseWithoutData(res, 200, true, 'Vendor deleted successfully');
  } catch (error: any) {
    logger.error(`Error deleting vendor: ${error.message}`);
    errorResponse(res, error.message || 'Failed to delete vendor.');
  }
};

export const verifyOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;
    const vendor = await getvendorMobile(mobile);
    if (!vendor) {
      responseWithoutData(res, 404, false, 'Customer not found');
    }else{
      const verificationResult = await verifyOTP(mobile, otp);
      if (!verificationResult.success) {
        return errorResponse(res, 'Invalid or expired OTP', 400);
      }
      const accessToken = generateAccessToken(vendor._id);
      const refreshToken = generateRefreshToken(vendor._id);
      const device: any = req.headers['x-device'] || 'Unknown';
      const ip = req.ip || 'Unknown';
      const vendorId = vendor?._id;
      const token = await createOrUpdateVendorAccessToken(vendorId, device, ip, accessToken, refreshToken);
      responseWithData(res, 200, true, 'OTP verified successfully',
        {
          token
        });
    }
  } catch (error: any) {
    logger.error(`Error verifying OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to verify OTP.');
  }
};

export const verifyOTPForAdminHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;
    const verificationResult = await verifyOTPForAdmin(mobile, otp);
    if (!verificationResult.success) {
      return errorResponse(res, 'Invalid or expired OTP', 400);
    }
    responseWithData(res, 200, true, 'OTP verified successfully', verificationResult);
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

export const vendorLoginHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;
    const vendor = await getvendorMobile(mobile);
    
    if (!vendor) {
      responseWithoutData(res, 404, false, 'Vendor not found');
      return;
    }
   

    const passwordMatch = await checkPassword(mobile, password);
    if (!passwordMatch) {
      responseWithoutData(res, 401, false, 'Invalid credentials');
    } else {
      if (!vendor.verified) {
        responseWithoutData(res, 403, false, 'Your account is under verification.');
        return;
      }
  
      if (vendor.approved == "pending") {
        responseWithoutData(res, 403, false, 'Your account is under verification.');
        return;
    }
    
    if (vendor.approved =="rejected" ) {
        responseWithoutData(res, 403, false, 'Your account has been rejected.');
        return;
    }
      const accessToken = generateAccessToken(vendor._id.toString());
      const refreshToken = generateRefreshToken(vendor._id.toString());
      const device: any = req.headers['x-device'] || 'Unknown';
      const ip = req.ip || 'Unknown';
      const vendorId = vendor?._id;
      const token = await createOrUpdateVendorAccessToken(vendorId, device, ip, accessToken, refreshToken);

      responseWithData(res, 200, true, 'Login Successful', {
        token,
        loginType: 'aggregator',
      });
    }
  } catch (error: any) {
    console.error(`Error during vendor login: ${error.message}`);
    errorResponse(res, error.message || 'Failed to log in.');
  }
};


export const sendOTPHandler = async (req: Request, res: Response) => {
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
    });
  } catch (error: any) {
    logger.error(`Error sending OTP: ${error.message}`);
    errorResponse(res, error.message || 'Failed to send OTP.');
  }
};

export const loginOTPHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;
    const vendor = await getvendorMobile(mobile);
    if (!vendor) {
      responseWithoutData(res, 404, false, 'Aggregator not found');
    } else {
      const result = await verifyOTP(mobile, otp);
      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }
      if (vendor.approved == "pending") {
        responseWithoutData(res, 403, false, 'Your account is under verification.');
        return;
    }
    
    if (vendor.approved =="rejected" ) {
        responseWithoutData(res, 403, false, 'Your account has been rejected.');
        return;
    }
      const accessToken = generateAccessToken(vendor._id);
      const refreshToken = generateRefreshToken(vendor._id);
      const device: any = req.headers['x-device'] || 'Unknown';
      const ip = req.ip || 'Unknown';
      const vendorId = vendor?._id;
      const token = await createOrUpdateVendorAccessToken(vendorId, device, ip, accessToken, refreshToken);
      responseWithData(res, 200, true, 'Login Successful', {
        token,
        loginType: 'aggregatore',
      });
    }
  } catch (error: any) {
    logger.error(`Error Login: ${error.message}`);
    errorResponse(res, error.message || 'Failed to login user');
  }
};

export async function updateActiveStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { activeStatus } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      {
        activeStatus,
      },
      {
        new: true,
      },
    );

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }

    return res.json(vendor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

export async function updatePersonalDetails(req: Request, res: Response) {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        message: 'Missing Authorization Token',
      });
    }

    const vendorId: any = await TokenUserId(token);
    if (!vendorId) {
      return res.status(401).json({
        message: 'Invalid Authorization Token',
      });
    }

    const updateDto = req.body;

    const updatedVendor = await updateVendorPersonalDetailsService(vendorId, updateDto);
    if (!updatedVendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }

    return res.status(200).json({
      message: 'Personal details updated successfully',
      data: updatedVendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

export async function updatePersonalDetailsV2(req: Request, res: Response) {
  try {
    const {token} = req.query;
    if (!token) {
      return res.status(401).json({
        message: 'Missing Authorization Token',
      });
    }

    const vendorId: any = await TokenUserId(token);
    if (!vendorId) {
      return res.status(401).json({
        message: 'Invalid Authorization Token',
      });
    }

    const updateDto = req.body;

    const updatedVendor = await updateVendorPersonalDetailsService(vendorId, updateDto);
    if (!updatedVendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }

    return res.status(200).json({
      message: 'Personal details updated successfully',
      data: updatedVendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

export async function updateAddress(req: Request, res: Response) {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        message: 'Missing Authorization Token',
      });
    }

    const vendorId: any = await TokenUserId(token);
    if (!vendorId) {
      return res.status(401).json({
        message: 'Invalid Authorization Token',
      });
    }

    const updateDto = req.body;

    const updatedVendor = await updateVendorAddressService(vendorId, updateDto);

    if (!updatedVendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }

    return res.status(200).json({
      message: 'Address updated successfully',
      data: updatedVendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

export async function updatePersonalDetailsForAdmin(req: Request, res: Response) {
  try {
    const updateDto = req.body;
    const vendorId = req?.body?.vendorId;
    const updatedVendor = await updateVendorPersonalDetailsService(vendorId, updateDto);
    if (!updatedVendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }

    return res.status(200).json({
      message: 'Personal details updated successfully',
      data: updatedVendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

export async function updateAddressForAdmin(req: Request, res: Response) {
  try {
    const updateDto = req.body;
    const vendorId = req?.body?.vendorId;
    const updatedVendor = await updateVendorAddressService(vendorId, updateDto);
    if (!updatedVendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      });
    }
    return res.status(200).json({
      message: 'Address updated successfully',
      data: updatedVendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
}

export const approveVendorHandler = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    const vendor = await approveVendor(vendorId);
    if (!vendor) {
      return errorResponse(res, 'Vendor not found', 404);
    }
    responseWithData(res, 200, true, 'Vendor approved successfully', vendor);
  } catch (error: any) {
    logger.error(`Error approving vendor: ${error.message}`);
    errorResponse(res, error.message || 'Failed to approve vendor.');
  }
};

export const rejectVendorHandler = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    const vendor = await rejectVendor(vendorId);
    if (!vendor) {
      return errorResponse(res, 'Vendor not found', 404);
    }
    responseWithoutData(res, 200, true, 'Vendor rejected successfully');
  } catch (error: any) {
    logger.error(`Error rejecting vendor: ${error.message}`);
    errorResponse(res, error.message || 'Failed to reject vendor.');
  }
};

export const registerBankHandler = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        message: 'Missing Authorization Token',
      });
    }

    const vendorId: any = await TokenUserId(token);
    if (!vendorId) {
      return res.status(401).json({
        message: 'Invalid Authorization Token',
      });
    }

    const bankDto = req.body;

    const newBank = await createBank(vendorId, bankDto);

    return res.status(200).json({
      message: 'Bank details updated successfully',
      data: newBank,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export const registerBankForAdminHandler = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req?.body;

    const bankDto = req.body;

    const newBank = await createBank(vendorId, bankDto);

    return res.status(200).json({
      message: 'Bank details updated successfully',
      data: newBank,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getVendorProfileHandler = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }
    const vendorId: any = await TokenVendorProfile(token);
    if (!vendorId) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    const vendorProfile = await getVendorById(vendorId);
    if (!vendorProfile) {
      return responseWithoutData(res, 404, false, 'Vendor not found');
    }
    responseWithData(res, 200, true, 'Vendor profile retrieved successfully', vendorProfile);
  } catch (error: any) {
    logger.error(`Error retrieving vendor profile: ${error.message}`);
    if (!res.headersSent) {
      errorResponse(res, error.message || 'Failed to retrieve vendor profile.');
    }
  }
};


export const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const result = await forgotPassword(mobile);  
    if (!result.success) {
      return errorResponse(res, result.message, 400);
    }
    responseWithoutData(res, 200, true, result.message);
  } catch (error: any) {
    logger.error(`Error initiating password reset: ${error.message}`);
    errorResponse(res, error.message || 'Failed to initiate password reset.');
  }
};
;
export const changePasswordHandler = async (req: Request, res: Response) => {
  try {
    const { mobile, otp, newPassword } = req.body;
    const result = await resetPassword(mobile, otp, newPassword);  
    if (!result.success) {
      return errorResponse(res, result.message, 400);
    }
    responseWithoutData(res, 200, true, result.message);
  } catch (error: any) {
    logger.error(`Error changing password: ${error.message}`);
    errorResponse(res, error.message || 'Failed to change password.');
  }
};

export const updatePasswordHandler = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }
    const vendorId: any = await TokenVendorProfile(token);
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return errorResponse(res, 'Old password, new password, and confirm password are required.', 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'New password and confirm password do not match.', 400);
    }
    const result = await updatePassword(vendorId, oldPassword, newPassword);

    if (!result.success) {
      return errorResponse(res, result.message, 400);
    }

    responseWithoutData(res, 200, true, result.message);
  } catch (error: any) {
    logger.error(`Error changing password: ${error.message}`);
    errorResponse(res, error.message || 'Failed to change password.');
  }
};