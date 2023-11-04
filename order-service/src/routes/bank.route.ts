import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { OrderController } from '@/controllers/order.controller';
import { ValidateBody } from '@/middlewares/validation.middleware';
import { orderInputSchema } from '@/utils/schemas/order';
import { BankController } from '@/controllers/bank.controller';

export class BankRoute implements Routes {
  public router = Router();
  public bank = new BankController();
  public path = '/bank';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.bank.getAll);

    // this.router.get(`${this.path}`, ValidationMiddleware(CreateUserDto), this.order.test);
  }
}
