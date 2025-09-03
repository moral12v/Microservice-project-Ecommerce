import { Request, Response, NextFunction } from 'express';

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    status: false,
    message: 'Route not found.',
  });
};

export default notFoundMiddleware;
