import { API_SECRET } from "../config";
import { StoreDoc } from "../models/Store";
import { storeRepository } from "../repositories/storeRespository";

import jwt from 'jsonwebtoken'

  export const authValues = async (userId: any): Promise<StoreDoc | null> => {
    try {
      const customer = await storeRepository.getStoreById(userId);
      return customer;
    } catch (error) {
      console.error('Error verifying token or finding Store:', error);
      return null;
    }
  };

  export function verifyToken(token: string): any {
    try {
      return jwt.verify(token, API_SECRET);
    } catch (error) {
      console.error('Error verifying tokens:', error);
      return null;
    }
  }

  export const TokenStoreProfile = async (token: any) => {
    try {
      const storeId = verifyToken(token);
      const store = await storeRepository.getStoreById(storeId);
      return store;
    } catch (error) {
      console.error('Error verifying token or finding customer:', error);
      return null;
    }
  };
  