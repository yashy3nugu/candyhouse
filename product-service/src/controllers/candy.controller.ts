import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class CandyController {
  public all = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send({});
    } catch (error) {}
  };
}
