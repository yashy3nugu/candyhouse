import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { OrderController } from '@/controllers/order.controller';
import { ValidateBody, ValidateParams, ValidateQuery } from '@/middlewares/validation.middleware';
import { orderByIdSchema, orderInputSchema, paginatedOrderFetchSchema } from '@/utils/schemas/order';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class OrderRoute implements Routes {
  public router = Router();
  public order = new OrderController();
  public path = '/order';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.order.test);
    this.router.post(`${this.path}`, ValidateBody(orderInputSchema), AuthMiddleware, this.order.create);
    this.router.get(`${this.path}/user`, ValidateQuery(paginatedOrderFetchSchema), AuthMiddleware, this.order.getOrdersOfUser);
    this.router.get(`${this.path}/:id`, ValidateParams(orderByIdSchema), this.order.oneById);

    // this.router.get(`${this.path}`, ValidationMiddleware(CreateUserDto), this.order.test);
  }
}
