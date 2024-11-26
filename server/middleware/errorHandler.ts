import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/errors.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleError(err, res);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    error: 'Resource not found',
    code: 'NOT_FOUND',
  });
};