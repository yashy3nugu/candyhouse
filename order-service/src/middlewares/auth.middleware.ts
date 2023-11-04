import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
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

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { appId } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;

      const foundUser = (await UserModel.findOne({ appId })).toObject();

      if (foundUser) {
        if (foundUser.role === Role.User) {
          req.user = foundUser;

          next();
        } else {
          next(new HttpException(401, 'Only vendors can perform this action'));
        }
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    console.log(error);
    next(new HttpException(401, 'Error while processing auth token'));
  }
};
