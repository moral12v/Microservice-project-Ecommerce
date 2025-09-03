import { Request, Response, NextFunction } from 'express';
import VendorAccessToken from '../models/vendorAccessModel';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import { authValues } from '../utils/vendorAuthValues';
import { verifyToken } from '../services/jwtServices';

export const vendorQueryAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {token}:any = req.query;
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

    const accessTokenExists = await VendorAccessToken.exists({
      vendorId: decoded._id,
      accessToken: token,
      isActive: true,
    });

    if (accessTokenExists) {
      next();
      // if (decoded.isActive == true) {
      //   next();
      // } else {
      //   return res.status(403).send({ status: false, msg: 'Vendor is Inactive. Please Verify' });
      // }
    } else {
      return res.status(401).send({
        status: false,
        msg: 'Invalid Token',
      });
    }
  } catch (error: any) {
    console.error(error);
    errorResponse(res, error.message || 'Failed to verify Vendor.');
  }
};
