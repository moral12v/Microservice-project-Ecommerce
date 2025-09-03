import { AdminDoc } from '../models/Admin';
import AdminRepository from '../repositories/adminRepository';

import { CreateAdminDTO } from '../dtos/AdminDTO';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { generateOTP, sendMobileOtp, setOTPExpiry } from '../utils/otp';

const adminRepository = new AdminRepository();

export const createAdmin = async (adminDto: CreateAdminDTO): Promise<AdminDoc> => {
  const existingAdmin = await adminRepository.findByEmail(adminDto.email);
  if (existingAdmin) {
    throw new Error('Email is already registered');
  }
  const hashedPassword = await hashPassword(adminDto.password);
  const newAdminData = {
    ...adminDto,
    password: hashedPassword,
  };
  return await adminRepository.createAdmin(newAdminData);
};

export const getAllAdmins = async (): Promise<AdminDoc[]> => {
  return await adminRepository.getAllAdmins();
};

export const getAdminById = async (adminId: string): Promise<AdminDoc | null> => {
  return await adminRepository.getAdminById(adminId);
};

export const getAdminByEmail = async (email: string): Promise<AdminDoc | null> => {
  return await adminRepository.findByEmail(email);
};

export const checkPassword = async (email: string, password: string): Promise<boolean> => {
  const admin = await adminRepository.findByEmail(email);

  if (admin) {
    const passwordMatch = await comparePassword(password, admin.password);
    return passwordMatch;
  }

  return false;
};

export const updateAdminPassword = async (adminId: string, passwordDto: CreateAdminDTO): Promise<void> => {
  const admin = await adminRepository.getAdminById(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  const isPasswordMatch = await comparePassword(passwordDto.currentPassword, admin.password);
  if (!isPasswordMatch) {
    throw new Error('Current password is incorrect');
  }

  const hashedNewPassword = await hashPassword(passwordDto.newPassword);
  admin.password = hashedNewPassword;
  await admin.save();
};

export const verifyOTP = async (
  adminId: string,
  otp: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const admin = await adminRepository.getAdminById(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  if (admin.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }

  if (admin.otpExpires && admin.otpExpires <= new Date()) {
    return {
      success: false,
      message: 'OTP has expired',
    };
  }

  admin.otp = undefined;
  admin.otpExpires = undefined;
  await admin.save();
  return {
    success: true,
    message: 'OTP verified successfully',
  };
};

export const resendOTP = async (
  adminId: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const admin = await adminRepository.getAdminById(adminId);

  if (!admin) {
    return {
      success: false,
      message: 'Admin not found',
    };
  }

  const newOTP = generateOTP();
  await sendMobileOtp(admin?.mobile, newOTP);
  const otpExpires = setOTPExpiry();
  admin.otp = newOTP;
  admin.otpExpires = otpExpires;
  await admin.save();
  return {
    success: true,
    message: 'OTP resent successfully',
  };
};
