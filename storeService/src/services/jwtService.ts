import { API_SECRET, REFRESH_TOKEN_SECRET } from "../config"; 
import { TokenPayloadDTO } from "../dtos/jwtDto";
import jwt from 'jsonwebtoken';



export function generateAccessToken(payload: any): string {
  return jwt.sign(payload.toString(), API_SECRET);
}



export function generateRefreshToken(payload: any): string {
  const refreshExpiration = '7d'; 
  return jwt.sign(
    { ...payload.toString(), exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * parseInt(refreshExpiration, 10)) }, // Clearer expiration calculation
    REFRESH_TOKEN_SECRET,
  );
}



export function verifyToken(token: string):any {
  try {
    console.log(token, 'payload');
     return jwt.verify(token, API_SECRET);
  } catch (error) {
     console.error('Error verifying tokens:', error);
     return null;
  }
}
