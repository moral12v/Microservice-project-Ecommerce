import { customerRepository } from '../repositories/customerRepository';
import { API_SECRET } from '../config';
import { CustomerDoc } from '../models/Customer';
import { verifyToken } from '..//services/jwtServices';

export const authValues = async (userId: any): Promise<CustomerDoc | null> => {
  try {
    const customer = await customerRepository.getCustomerById(userId);
    return customer;
  } catch (error) {
    console.error('Error verifying token or finding customer:', error);
    return null;
  }
};

export const TokenUserId = async (token: any) => {
  try {
    const customerId = verifyToken(token);
    return customerId;
  } catch (error) {
    console.error('Error verifying token or finding customer:', error);
    return null;
  }
};

export const TokenUserProfile = async (token: any) => {
  try {
    const customerId = verifyToken(token);
    const customer = await customerRepository.getCustomerById(customerId);
    return customer;
  } catch (error) {
    console.error('Error verifying token or finding customer:', error);
    return null;
  }
};
