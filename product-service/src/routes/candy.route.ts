import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import { CandyController } from '@/controllers/candy.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { paginatedCandyFetchSchema } from '@/utils/schemas/candy';

export class CandyRoute implements Routes {
  public router = Router();
  public candy = new CandyController();
  public path = '/candy';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, ValidationMiddleware(paginatedCandyFetchSchema), this.candy.all);
  }
}
