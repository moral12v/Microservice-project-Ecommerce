import { API_SECRET, REFRESH_TOKEN_SECRET } from '../config';
import { TokenPayloadDTO } from '../dtos/jwtDTO';
import jwt from 'jsonwebtoken';

import { CustomerDoc } from '../models/Customer';

export function generateAccessToken(payload: any): string {
  return jwt.sign(payload.toString(), API_SECRET);
}

export function generateRefreshToken(payload: any): string {
  const refreshExpiration = '7d';
  return jwt.sign(
    {
      ...payload.toString(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * parseInt(refreshExpiration, 10),
    },
    REFRESH_TOKEN_SECRET,
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, API_SECRET);
  } catch (error) {
    console.error('Error verifying tokens:', error);
    return null;
  }
}
