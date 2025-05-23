import { Response } from 'express';

export const successResponse = (res: Response, statusCode: number, message: string, data: any = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (res: Response, statusCode: number, message: string, error: any = null) => {
  return res.status(statusCode).json({ success: false, message, error });
};
