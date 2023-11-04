import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { OrderController } from '@/controllers/order.controller';
import { ValidateBody, ValidateParams, ValidateQuery } from '@/middlewares/validation.middleware';
import { orderByIdSchema, orderInputSchema, orderUpdateSchema, paginatedOrderFetchSchema } from '@/utils/schemas/order';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/utils/types/user';

export class OrderRoute implements Routes {
  public router = Router();
  public order = new OrderController();
  public path = '/order';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, ValidateQuery(paginatedOrderFetchSchema), AuthMiddleware([Role.Admin]), this.order.allForAdmin);
    this.router.post(`${this.path}`, ValidateBody(orderInputSchema), AuthMiddleware([Role.User]), this.order.create);
    this.router.get(`${this.path}/user`, ValidateQuery(paginatedOrderFetchSchema), AuthMiddleware([Role.User]), this.order.getOrdersOfUser);
    this.router.get(`${this.path}/:id`, ValidateParams(orderByIdSchema), AuthMiddleware([Role.User, Role.Admin]), this.order.oneById);
    this.router.post(`${this.path}/cancel/:id`, ValidateParams(orderByIdSchema), AuthMiddleware([Role.User]), this.order.cancel);
    this.router.patch(`${this.path}/:id`, ValidateParams(orderByIdSchema), ValidateBody(orderUpdateSchema), this.order.update);

    // this.router.get(`${this.path}`, ValidationMiddleware(CreateUserDto), this.order.test);
  }
}
