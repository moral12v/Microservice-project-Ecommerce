import { Types } from 'mongoose';
import CustomerAccessToken from '../models/CustomerAccessToken';

interface IAccessToken {
  accessToken: string;
  refreshToken: string;
}

const MAX_ACTIVE_TOKENS_PER_USER = 2;

export const createOrUpdateCustomerAccessToken = async (
  customerId: any,
  device: string,
  ip: string,
  accessToken: string,
  refreshToken: string,
): Promise<IAccessToken> => {
  let existingTokens = await CustomerAccessToken.find({
    customerId,
    isActive: true,
  }).sort({
    createdAt: 1,
  });

  if (existingTokens.length >= MAX_ACTIVE_TOKENS_PER_USER) {
    const oldestToken = existingTokens[0];

    if (oldestToken) {
      await CustomerAccessToken.findByIdAndUpdate(
        oldestToken._id,
        {
          $set: {
            accessToken,
            refreshToken,
            loginInfo: {
              device,
              ip,
              lastLogin: new Date().toISOString(),
            },
            isActive: true,
          },
        },
        {
          new: true,
        },
      );

      return {
        accessToken,
        refreshToken,
      };
    }
  }

  const loginInfo = {
    device,
    ip,
    lastLogin: new Date().toISOString(),
  };

  const newAccessToken = new CustomerAccessToken({
    customerId,
    accessToken,
    refreshToken,
    loginInfo,
    isActive: true,
  });

  await newAccessToken.save();

  return {
    accessToken,
    refreshToken,
  };
};
