import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '@utils/response';
import { HttpStatus } from '@utils/httpStatus';
import { Messages } from '@utils/messages';
import { logger } from '@config/logger';

interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export class AuthMiddleware {
  static authenticate(): RequestHandler {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('Authentication failed: No token or incorrect token format');
        errorResponse(res, HttpStatus.UNAUTHORIZED, Messages.UNAUTHORIZED);
        return;
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = { id: decoded.id };
        logger.info(`Authentication successful for user ID: ${decoded.id}`);
        next();
      } catch (err: any) {
        logger.error(`Authentication error: Invalid token - ${err.message}`);
        errorResponse(res, HttpStatus.UNAUTHORIZED, Messages.INVALID_TOKEN);
        return;
      }
    };
  }
}
