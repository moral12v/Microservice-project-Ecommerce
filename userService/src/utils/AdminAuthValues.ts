import { adminRepository } from '../repositories/adminRepository';
import { API_SECRET } from '../config';
import { AdminDoc } from '../models/Admin';
import { verifyToken } from '../services/jwtServices';

export const authValues = async (adminId: any): Promise<AdminDoc | null> => {
  try {
    const admin = await adminRepository.getAdminById(adminId);
    return admin;
  } catch (error) {
    console.error('Error verifying token or finding customer:', error);
    return null;
  }
};

export const TokenAdminId = async (token: any) => {
  try {
    const adminId = verifyToken(token);
    return adminId;
  } catch (error) {
    console.error('Error verifying token or finding admin:', error);
    return null;
  }
};

export const TokenUserProfile = async (token: any) => {
  try {
    const adminId = verifyToken(token);
    const admin = await adminRepository.getAdminById(adminId);
    return admin;
  } catch (error) {
    console.error('Error verifying token or finding admin:', error);
    return null;
  }
};
