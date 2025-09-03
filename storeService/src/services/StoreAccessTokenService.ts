import { Types } from "mongoose";
import MerchantAccessToken from "../models/StoreAccessModel";

interface IAccessToken {
  accessToken: string;
  refreshToken: string;
}

const MAX_ACTIVE_TOKENS_PER_MERCHANT = 2;



export const createOrUpdateMerchantAccessToken = async (
  storeId: any,
    device: string,
    ip: string,
    accessToken: string,
    refreshToken: string
  ): Promise<IAccessToken> => {
    let existingTokens = await MerchantAccessToken.find({
      storeId,
      isActive: true,
    }).sort({ createdAt: 1 });
  
    if (existingTokens.length >= MAX_ACTIVE_TOKENS_PER_MERCHANT) {
      const oldestToken = existingTokens[0];
  
      if (oldestToken) {
        await MerchantAccessToken.findByIdAndUpdate(
          oldestToken._id,
          {
            $set: {
              accessToken,
              refreshToken,
              loginInfo: { device, ip, lastLogin: new Date().toISOString() },
              isActive: true,
            },
          },
          { new: true }
        );
  
        return { accessToken, refreshToken };
      }
    }
  
    const loginInfo = {
      device,
      ip,
      lastLogin: new Date().toISOString(),
    };
  
    const newAccessToken = new MerchantAccessToken({
      storeId,
      accessToken,
      refreshToken,
      loginInfo,
      isActive: true,
    });
  
    await newAccessToken.save();
  
    return { accessToken, refreshToken };
  };
  
  export const deleteAdminAccessToken = async (
    storeId: Types.ObjectId,
    refreshToken: string
  ): Promise<void> => {
    await MerchantAccessToken.findOneAndDelete({
      storeId,
      refreshToken,
    });
  };