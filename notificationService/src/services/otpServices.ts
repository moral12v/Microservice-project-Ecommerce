import axios, { AxiosRequestConfig } from 'axios';
import { message91_AUTH_KEY, message91_OTP_TEMP_ID, OTP_SEND_URL } from '../config';
import logger from '../utils/logger';

export const sendOtpSMS = async (number: string, username: string, otp: string, purpose: string): Promise<boolean> => {
  try {
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `${OTP_SEND_URL}?template_id=${message91_OTP_TEMP_ID}&mobile=${number}&otp=${otp}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authkey: message91_AUTH_KEY,
      },
      data: { user: username, purpose: purpose },
    };
    const response = await axios.request(options);
    if (response.data.type === 'success') {
      logger.info(`OTP sent successfully to ${number}`);
      return true;
    } else {
      logger.error(`Failed to send OTP: ${response.data}`);
      return false;
    }
  } catch (error: any) {
    logger.error(`Error sending OTP: ${error.message}`);
    return false; 
  }
};
