import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { API_SECRET } from '../config';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';

interface JwtPayload {
  adminId: string;
}

const verifyToken = (token: string): string | JwtPayload | null => {
  try {
    return jwt.verify(token, API_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const AdminAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return res.status(401).send({ status: false, msg: 'Invalid Token' });
    }

    // const decoded = verifiedToken as JwtPayload;
    // const user = await getUserDetails(decoded.userId);
    // if (!user) {
    //   return res.status(401).send({ status: false, msg: 'Invalid Token' });
    // }

    next();
  } catch (error) {
  
  }
};
