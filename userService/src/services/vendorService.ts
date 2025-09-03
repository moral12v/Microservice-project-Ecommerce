import { VendorDoc } from '../models/Vendor';
import { vendorRepository } from '../repositories/vendorRepository';
import { CreateBankDTO, CreateVendorDTO, UpdateVendorPersonalDetailsDTO } from '../dtos/VendorDTO';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { generateOTP, sendMobileOtp, setOTPExpiry } from '../utils/otp';

export const createVendor = async (vendorDto: CreateVendorDTO): Promise<any> => {
  const { mobile, password } = vendorDto;
  const existingVendor = await vendorRepository.findByMobile(mobile);

  if (existingVendor) {
      if (!existingVendor.verified) {
          const newOTP = generateOTP();
          await sendMobileOtp(mobile, newOTP);
          const otpExpires = setOTPExpiry();
          existingVendor.otp = newOTP;
          existingVendor.otpExpires = otpExpires;
          await vendorRepository.updateVendor(existingVendor._id, existingVendor);     
          return {
              ...existingVendor,
              message: 'Mobile number is already registered. A new OTP has been sent.'
          };
      } else {
          throw new Error('Mobile number is already registered and verified.');
      }
  } else {
      const hashedPassword = await hashPassword(password);
      const newOTP = generateOTP();
      await sendMobileOtp(mobile, newOTP);
      const otpExpires = setOTPExpiry();

      const newVendorData = {
          ...vendorDto,
          password: hashedPassword,
          otp: newOTP,
          otpExpires,
          isVerified: false 
      };
      const newVendor = await vendorRepository.createVendor(newVendorData);
      return newVendor;
  }
};

export const getAllVendors = async (): Promise<VendorDoc[]> => {
  return await vendorRepository.getAllVendor();
};

export const getVendorById = async (vendorId: string): Promise<VendorDoc | null> => {
  return await vendorRepository.getVendorById(vendorId);
};
export const getvendorMobile = async (mobile: string): Promise<VendorDoc | null> => {
  return await vendorRepository.findByMobile(mobile);
};
export const checkPassword = async (mobile: string, password: string): Promise<boolean> => {
  const vendor = await vendorRepository.findByMobile(mobile);

  if (vendor) {
    const passwordMatch = await comparePassword(password, vendor.password);
    return passwordMatch;
  }

  return false;
};

export const updateVendorPassword = async (vendorId: string, passwordDto: CreateVendorDTO): Promise<void> => {
  const vendor = await vendorRepository.getVendorById(vendorId);
  if (!vendor) {
    throw new Error('Vendor not found');
  }

  const isPasswordMatch = await comparePassword(passwordDto.currentPassword, vendor.password);
  if (!isPasswordMatch) {
    throw new Error('Current password is incorrect');
  }

  const hashedNewPassword = await hashPassword(passwordDto.newPassword);
  vendor.password = hashedNewPassword;
  await vendor.save();
};


export const DeleteVendor = async (vendorId: string): Promise<{ message: string }> => {
  const vendor = await vendorRepository.getVendorById(vendorId);
  if (!vendor) {
    throw new Error('Vendor not found');
  }

  await vendorRepository.deleteVendor(vendorId);
  return { message: 'Vendor deleted successfully' };
};


export const verifyOTP = async (
  mobile: string,
  otp: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const vendor = await vendorRepository.findByMobile(mobile);
  if (!vendor) {
    throw new Error('Vendor not found');
  }

  if (vendor.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }

  if (vendor.otpExpires && vendor.otpExpires <= new Date()) {
    return {
      success: false,
      message: 'OTP has expired',
    };
  }

  vendor.otp = undefined;
  vendor.otpExpires = undefined;
  vendor.verified = true;
  await vendor.save();
  return {
    success: true,
    message: 'OTP verified successfully',
  };
};

export const verifyOTPForAdmin = async (
  mobile: string,
  otp: string,
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> => {
  const vendor = await vendorRepository.findByMobile(mobile);
  if (!vendor) {
    throw new Error('Vendor not found');
  }

  if (vendor.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
      data: '',
    };
  }

  if (vendor.otpExpires && vendor.otpExpires <= new Date()) {
    return {
      success: false,
      message: 'OTP has expired',
      data: '',
    };
  }

  vendor.otp = undefined;
  vendor.otpExpires = undefined;
  vendor.verified = true;
  await vendor.save();
  return {
    success: true,
    message: 'OTP verified successfully',
    data: vendor,
  };
};

export const resendOTP = async (
  mobile: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const vendor = await vendorRepository.findByMobile(mobile);

  if (!vendor) {
    return {
      success: false,
      message: 'Vendor not found',
    };
  }
  const newOTP = generateOTP();
  await sendMobileOtp(mobile, newOTP);
  const otpExpires = setOTPExpiry();
  vendor.otp = newOTP;
  vendor.otpExpires = otpExpires;
  await vendor.save();
  return {
    success: true,
    message: 'OTP sent successfully',
  };
};

export async function updateVendorPersonalDetailsService(vendorId: string, updateDto: UpdateVendorPersonalDetailsDTO) {
  return await vendorRepository.updateVendorPersonalDetails(vendorId, updateDto);
}

export async function updateVendorAddressService(vendorId: string, updateDto: UpdateVendorPersonalDetailsDTO) {
  return await vendorRepository.updateVendorAddress(vendorId, updateDto);
}

export const getVendorsWithPagination = async (
  page: number,
  limit: number,
  approvalStatus: string,
  isPagination: string,
): Promise<{
  vendors: VendorDoc[];
  total: number;
}> => {
  return await vendorRepository.getVendorsWithPagination(page, limit, approvalStatus, isPagination);
};

export const approveVendor = async (vendorId: string): Promise<VendorDoc | null> => {
  return await vendorRepository.approveVendor(vendorId);
};

export const rejectVendor = async (vendorId: string): Promise<VendorDoc | null> => {
  return await vendorRepository.rejectVendor(vendorId);
};

export const createBank = async (vendorId: string, bankDto: CreateBankDTO): Promise<VendorDoc> => {
  return await vendorRepository.createBank(vendorId, bankDto);
};

export const forgotPassword = async (
  mobile: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const vendor = await vendorRepository.findByMobile(mobile);

  if (!vendor) {
    return {
      success: false,
      message: 'Vendor not found',
    };
  }
  const resetOTP = generateOTP();
  await sendMobileOtp(mobile, resetOTP);
  const otpExpires = setOTPExpiry();

  vendor.otp = resetOTP;
  vendor.otpExpires = otpExpires;
  await vendor.save();

  return {
    success: true,
    message: 'Password reset OTP sent successfully',
  };
};

export const resetPassword = async (
  mobile: string,
  otp: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const vendor = await vendorRepository.findByMobile(mobile);

  if (!vendor) {
    return {
      success: false,
      message: 'Vendor not found',
    };
  }
  if (vendor.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }
  const hashedNewPassword = await hashPassword(newPassword);
  vendor.password = hashedNewPassword;
  await vendor.save();

  return {
    success: true,
    message: 'Password reset successfully',
  };
};

export const changePassword = async (
  vendorId: string,
  currentPassword: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const vendor = await vendorRepository.getVendorById(vendorId);
  if (!vendor) {
    throw new Error('Vendor not found');
  }
  const isPasswordMatch = await comparePassword(currentPassword, vendor.password);
  if (!isPasswordMatch) {
    throw new Error('Current password is incorrect');
  }

  const hashedNewPassword = await hashPassword(newPassword);
  vendor.password = hashedNewPassword;
  await vendor.save();
  return {
    success: true,
    message: 'Password changed successfully',
  };
};

export const updatePassword = async (
  vendorId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const vendor = await vendorRepository.getVendorById(vendorId);

    if (!vendor) {
      return {
        success: false,
        message: 'Vendor not found',
      };
    }

    const isPasswordMatch = await comparePassword(oldPassword, vendor.password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: 'Old password is incorrect',
      };
    }

    const hashedNewPassword = await hashPassword(newPassword);
    vendor.password = hashedNewPassword;
    await vendor.save();

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error: any) {
    console.error(`Error changing password: ${error.message}`);
    return {
      success: false,
      message: 'Failed to change password',
    };
  }
};