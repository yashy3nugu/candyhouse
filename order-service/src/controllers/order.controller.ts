import { NextFunction, Request, Response } from 'express';

export class OrderController {
  public test = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send('test');
    } catch (error) {
      next(error);
    }
  };
}
