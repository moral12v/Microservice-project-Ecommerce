import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { API_SECRET } from '../config';
import CustomerAccessToken from '../models/CustomerAccessToken';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import { authValues } from '../utils/customerAuthValues';
import { verifyToken } from '../services/jwtServices';

interface JwtPayload {
  userId: string;
}

export const customerAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return res.status(401).send({
        status: false,
        msg: 'Token Expired',
      });
    }
    const decoded = await authValues(verifiedToken);
    if (!decoded) {
      return res.status(401).send({
        status: false,
        msg: 'Invalid Token',
      });
    }

    const accessTokenExists = await CustomerAccessToken.exists({
      customerId: decoded._id,
      accessToken: token,
      isActive: true,
    });

    if (accessTokenExists) {
      next();
      // if (decoded.isActive == true) {
      //   next();
      // } else {
      //   return res.status(403).send({ status: false, msg: 'User is Inactive. Please Verify' });
      // }
    } else {
      return res.status(401).send({
        status: false,
        msg: 'Invalid Token',
      });
    }
  } catch (error: any) {
    console.error(error);
    errorResponse(res, error.message || 'Failed to verify customer.');
  }
};
