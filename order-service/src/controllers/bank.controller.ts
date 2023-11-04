import { Request, Response, NextFunction } from 'express';
import BankModel from '@models/bank.model';

export class BankController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const banks = await BankModel.find();

      res.json({ banks });
    } catch (error) {
      next(error);
    }
  };
}
