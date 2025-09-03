import { Types } from 'mongoose';
import VendorAccessToken from '../models/vendorAccessModel';

interface IAccessToken {
  accessToken: string;
  refreshToken: string;
}

const MAX_ACTIVE_TOKENS_PER_VENDOR = 2;

export const createOrUpdateVendorAccessToken = async (
  vendorId: any,
  device: string,
  ip: string,
  accessToken: string,
  refreshToken: string,
): Promise<IAccessToken> => {
  let existingTokens = await VendorAccessToken.find({
    vendorId,
    isActive: true,
  }).sort({
    createdAt: 1,
  });

  if (existingTokens.length >= MAX_ACTIVE_TOKENS_PER_VENDOR) {
    const oldestToken = existingTokens[0];

    if (oldestToken) {
      await VendorAccessToken.findByIdAndUpdate(
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

  const newAccessToken = new VendorAccessToken({
    vendorId,
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
