import { Request, Response } from 'express';
import { sendOtpSMS } from '../services/otpServices';
import logger from '../utils/logger';
import { NotificationRequestDTO } from '../dtos/notificationRequest';

export const handleOtpNotificationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, username, otp, purpose } = req.body as NotificationRequestDTO;
    await sendOtpSMS(phone, username, otp, purpose);
    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error: any) {
    logger.error(`Error sending OTP: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
};
