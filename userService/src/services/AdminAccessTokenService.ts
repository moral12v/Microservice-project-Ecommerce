import { Types } from 'mongoose';
import AdminAccessToken from '../models/AdminAccessModel';

interface IAccessToken {
  accessToken: string;
  refreshToken: string;
}

const MAX_ACTIVE_TOKENS_PER_ADMIN = 2;

export const createOrUpdateAdminAccessToken = async (
  adminId: any,
  device: string,
  ip: string,
  accessToken: string,
  refreshToken: string,
): Promise<IAccessToken> => {
  let existingTokens = await AdminAccessToken.find({
    adminId,
    isActive: true,
  }).sort({
    createdAt: 1,
  });

  if (existingTokens.length >= MAX_ACTIVE_TOKENS_PER_ADMIN) {
    const oldestToken = existingTokens[0];

    if (oldestToken) {
      await AdminAccessToken.findByIdAndUpdate(
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

  const newAccessToken = new AdminAccessToken({
    adminId,
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

export const deleteAdminAccessToken = async (adminId: Types.ObjectId, refreshToken: string): Promise<void> => {
  await AdminAccessToken.findOneAndDelete({
    adminId,
    refreshToken,
  });
};
