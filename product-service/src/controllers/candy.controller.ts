import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import CandyModel from '@/models/candy.model';
import { z } from 'zod';
import { paginatedCandyFetchSchema } from '@/utils/schemas/candy';

export class CandyController {
  public all = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { page, limit }: z.infer<typeof paginatedCandyFetchSchema> = req.body;

      if (!page) page = 1;
      if (!limit) limit = 6;

      const candies = await CandyModel.find()
        .skip((page - 1) * limit)
        .limit(limit + 1)
        .populate('vendor');

      res.send({
        hasMore: candies.length === limit + 1,
        candies: candies.slice(0, limit),
      });
    } catch (error) {
      next(error);
    }
  };
}
