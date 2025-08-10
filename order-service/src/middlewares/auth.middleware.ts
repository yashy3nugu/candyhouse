import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@/models/user.model';
import { Role } from '@/utils/types/user';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = (allowedRoles: string[]) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    console.log(`[AuthMiddleware] Authorization token received: ${Authorization ? 'Yes' : 'No'}`);

    if (Authorization) {
      let decodedToken: DataStoredInToken;
      try {
        decodedToken = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
        console.log(`[AuthMiddleware] Token verified. appId: ${decodedToken.appId}`);
      } catch (verifyError) {
        console.error('[AuthMiddleware] Token verification failed:', verifyError);
        return next(new HttpException(401, 'Invalid authentication token'));
      }

      const foundUserDoc = await UserModel.findOne({ appId: decodedToken.appId });
      if (!foundUserDoc) {
        console.warn('[AuthMiddleware] No user found for appId:', decodedToken.appId);
        return next(new HttpException(401, 'Wrong authentication token'));
      }
      const foundUser = foundUserDoc.toObject();
      console.log(`[AuthMiddleware] User found: ${foundUser.appId}, role: ${foundUser.role}`);

      if (allowedRoles.includes(foundUser.role)) {
        req.user = foundUser;
        console.log(`[AuthMiddleware] User authorized with role: ${foundUser.role}`);
        next();
      } else {
        console.warn(`[AuthMiddleware] User role not allowed: ${foundUser.role}. Allowed roles: ${allowedRoles.join(', ')}`);
        next(new HttpException(401, 'Only vendors can perform this action'));
      }
    } else {
      console.warn('[AuthMiddleware] Authentication token missing');
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    console.error('[AuthMiddleware] Error while processing auth token:', error);
    next(new HttpException(401, 'Error while processing auth token'));
  }
};
