import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { API_SECRET } from "../config";
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from "../utils/response";
import { authValues, verifyToken } from "../utils/authValues";
import logger from "../utils/logger";

interface JwtPayload {
  storeId: string;
}

export const storeAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return responseWithoutData(
        res,
        401,
        false,
        "Missing Authorization Token"
      );
    }
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return responseWithoutData(res, 401, false, "Token Expired or Invalid");
    }
    const decoded = await authValues(verifiedToken);

    if (!decoded) {
      return responseWithoutData(res, 401, false, "Invalid Token");
    } else {
      next();
    }
  } catch (error) {
    logger.error("Error in storeAuthentication:", error);
    return responseWithoutData(res, 500, false, "Internal Server Error");
  }
};
