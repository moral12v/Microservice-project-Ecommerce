import { VendorDoc } from '../models/Vendor';
import { verifyToken } from '../services/jwtServices';
import { vendorRepository } from '../repositories/vendorRepository';

export const authValues = async (vendorId: any): Promise<VendorDoc | null> => {
  try {
    const vendor = await vendorRepository.getVendorById(vendorId);
    return vendor;
  } catch (error) {
    console.error('Error verifying token or finding Vendor:', error);
    return null;
  }
};

export const TokenUserId = async (token: any) => {
  try {
    const vendorId = verifyToken(token);
    return vendorId;
  } catch (error) {
    console.error('Error verifying token or finding vendor:', error);
    return null;
  }
};

export const TokenVendorProfile = async (token: any) => {
  try {
    const vendorId = verifyToken(token);
    const vendor = await vendorRepository.getVendorById(vendorId);
    return vendorId;
  } catch (error) {
    console.error('Error verifying token or finding vendor:', error);
    return null;
  }
};
