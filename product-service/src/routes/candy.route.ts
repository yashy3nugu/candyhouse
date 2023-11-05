import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import { CandyController } from '@/controllers/candy.controller';
import { ValidateBody, ValidateParams, ValidateQuery } from '@/middlewares/validation.middleware';
import { candyByIdSchema, candySchema, candyUpdateSchema, paginatedCandyFetchSchema } from '@/utils/schemas/candy';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/utils/types/user';

export class CandyRoute implements Routes {
  public router = Router();
  public candy = new CandyController();
  public path = '/candy';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, ValidateQuery(paginatedCandyFetchSchema), this.candy.all);
    this.router.get(`${this.path}/vendor`, ValidateQuery(paginatedCandyFetchSchema), AuthMiddleware([Role.Vendor]), this.candy.vendor);
    this.router.get(`${this.path}/:id`, ValidateParams(candyByIdSchema), this.candy.oneById);
    this.router.patch(`${this.path}/:id`, ValidateParams(candyUpdateSchema), AuthMiddleware([Role.Vendor]), this.candy.update);
    this.router.post(`${this.path}`, ValidateBody(candySchema), AuthMiddleware([Role.Vendor]), this.candy.create);
  }
}
