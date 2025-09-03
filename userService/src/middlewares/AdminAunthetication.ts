import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { API_SECRET } from '../config';
import AdminAccessToken from '../models/AdminAccessModel';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import { authValues } from '../utils/AdminAuthValues';
import { verifyToken } from '../services/jwtServices';

interface JwtPayload {
  userId: string;
}

export const AdminAuthentication = async (req: Request, res: Response, next: NextFunction) => {
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

    const accessTokenExists = await AdminAccessToken.exists({
      adminId: decoded._id,
      accessToken: token,
      isActive: true,
    });
    if (accessTokenExists) {
      next();
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
