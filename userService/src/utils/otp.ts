import axios, { AxiosRequestConfig } from 'axios';
import { MSG91_AUTH_KEY, MSG91_TEMPLATE_ID } from '../config';

export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const setOTPExpiry = (): Date => {
  const now = new Date();
  return new Date(now.getTime() + 2 * 60000);
};



export const sendMobileOtp = async (mobile: string, otp: string): Promise<boolean> => {
  const data = JSON.stringify({
    purpose: "Verification"
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://control.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}&mobile=91${mobile}&otp=${otp}`,
    headers: {
      'accept': 'application/json',
      'authkey': MSG91_AUTH_KEY,
      'content-type': 'application/json',
      'Cookie': 'PHPSESSID=sc5jtbhtfg0ooavoj9fihetjr7'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(response.data);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message); 
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
  }
};