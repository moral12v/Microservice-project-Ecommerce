import { Request, Response } from "express";
import {
  responseWithData,
  responseWithoutData,
  errorResponse,
} from "../utils/response";
import logger from "../utils/logger";

export const loginCustomerHandler = async (req: Request, res: Response) => {
    try {
      const {mobile , password } = req?.body

    
    } catch (error: any) {
      logger.error(`Error login user: ${error.message}`);
      errorResponse(res, error.message || "Failed to create user.");
    }
  };
  