import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import { CandyController } from '@/controllers/candy.controller';

export class CandyRoute implements Routes {
  public router = Router();
  public candy = new CandyController();
  public path = '/candy';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.candy.all);
  }
}
