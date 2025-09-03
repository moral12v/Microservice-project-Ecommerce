import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const logMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`${req.method.toUpperCase()} || ${fullUrl}`);
  next();
};
