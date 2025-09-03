import { Response } from 'express';

export const responseWithData = (res: Response, statusCode: number, success: boolean, message: string, data: any) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const responseWithoutData = (res: Response, statusCode: number, success: boolean, message: string) => {
  return res.status(statusCode).json({
    success,
    message,
  });
};

export const errorResponse = (res: Response, message: string, statusCode: number = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
