import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import { CandyController } from '@/controllers/candy.controller';
import { ValidateBody, ValidateParams, ValidateQuery } from '@/middlewares/validation.middleware';
import { candyByIdSchema, candySchema, candyUpdateSchema, paginatedCandyFetchSchema } from '@/utils/schemas/candy';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ImageController } from '@/controllers/image.controller';

export class ImageRoutes implements Routes {
  public router = Router();
  public image = new ImageController();
  public path = '/image';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.image.signedUrl);
  }
}
