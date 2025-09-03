import { CustomerDoc } from '../models/Customer';
import { customerRepository } from '../repositories/customerRepository';
import { CreateCustomerDTO } from '../dtos/CustomerDTO';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { generateOTP, sendMobileOtp, setOTPExpiry } from '../utils/otp';

export const createCustomer = async (customerDto: CreateCustomerDTO): Promise<any> => {
  const existingCustomer = await customerRepository.findByMobile(customerDto.mobile);
  const customerId = existingCustomer?._id.toString() || '';
  return await customerRepository.updateCustomer(customerId, customerDto);
};

export const sendOtp = async (mobile: string): Promise<any> => {
  const existingCustomer = await customerRepository.findByMobile(mobile);
  if (existingCustomer && !existingCustomer.isdeleted) {
    const newOTP = generateOTP();
    await sendMobileOtp(mobile, newOTP);
    const otpExpires = setOTPExpiry();

    existingCustomer.otp = newOTP;
    existingCustomer.otpExpires = otpExpires;
    await existingCustomer.save();

    return {
      success: true,
      message: 'OTP sent successfully',
      isRecentlyCreated: existingCustomer.isRecentlyCreated,
    };
  } else {
    const otp = generateOTP();
    await sendMobileOtp(mobile, otp);
    const otpExpiry = setOTPExpiry();
    const newCustomerData = {
      mobile: mobile,
      otp: otp,
      otpExpires: otpExpiry,
      isdeleted: false,  
    };
    await customerRepository.createCustomer(newCustomerData);

    return {
      success: true,
      message: 'OTP sent successfully',
      isRecentlyCreated: true,
    };
  }
};


export const getAllCustomer = async (
  page: number,
  limit: number,
  isPagination: string,
): Promise<{ customers: CustomerDoc[]; total: number }> => {
  return await customerRepository.getAllCustomer(page, limit, isPagination);
};

export const getCustomerById = async (customerId: string): Promise<CustomerDoc | null> => {
  return await customerRepository.getCustomerById(customerId);
};

export const verifyOTP = async (
  mobile: string,
  otp: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const customer = await customerRepository.findByMobile(mobile);
  if (!customer) {
    throw new Error('Customer not found');
  }
  if (customer.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }

  if (customer.otpExpires && customer.otpExpires <= new Date()) {
    return {
      success: false,
      message: 'OTP has expired',
    };
  }

  customer.otp = undefined;
  customer.otpExpires = undefined;
  customer.verified = true;
  customer.isRecentlyCreated = false;
  await customer.save();
  return {
    success: true,
    message: 'OTP verified successfully',
  };
};

export const resendOTP = async (
  mobile: string,
): Promise<{
  success: boolean;
  message: string;
  isRecentlyCreated?: boolean;
}> => {
  const customer = await customerRepository.findByMobile(mobile);

  if (!customer) {
    return {
      success: false,
      message: 'Customer not found',
    };
  }
  const newOTP = generateOTP();
  await sendMobileOtp(mobile, newOTP);
  const otpExpires = setOTPExpiry();
  customer.otp = newOTP;
  customer.otpExpires = otpExpires;
  await customer.save();
  return {
    isRecentlyCreated: customer.isRecentlyCreated,
    success: true,
    message: 'OTP sent successfully',
  };
};

export const getCustomerMobile = async (mobile: string): Promise<CustomerDoc | null> => {
  return await customerRepository.findByMobile(mobile);
};

export const deleteAccount = async (customerId: string): Promise<boolean> => {
  const deletedCustomerAccount = await customerRepository.deleteAccount(customerId);
  return !!deletedCustomerAccount;
};

export const updateDeviceId = async (userId: string, deviceId: string): Promise<CustomerDoc | null> => {
  try {
    const updatedUser = await customerRepository.updateDeviceId(userId, deviceId);
    return updatedUser;
  } catch (error: any) {
    throw new Error(`Error updating deviceId: ${error.message}`);
  }
};
