import { Request } from 'express';
import { User } from '@models/user.model';

export interface DataStoredInToken {
  appId: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
