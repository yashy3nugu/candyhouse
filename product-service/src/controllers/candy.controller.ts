import { NextFunction, Request, Response } from 'express';
import CandyModel from '@/models/candy.model';
import { z } from 'zod';
import { candyByIdSchema, candySchema, candyUpdateSchema, paginatedCandyFetchSchema } from '@/utils/schemas/candy';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/HttpException';
import { v4 as uuidv4 } from 'uuid';
import { producer } from '@/lib/kafka';
import { UserModel } from '@/models/user.model';
import { getCache, setCache, incrementCacheCounter } from '@/utils/redis';

export class CandyController {
  public all = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit }: z.infer<typeof paginatedCandyFetchSchema> = req.query;
      let pageNum;
      let limitNum = parseInt(limit);

      if (!page) {
        pageNum = 1;
      } else {
        pageNum = parseInt(page);
      }

      if (!limit) {
        limitNum = 6;
      } else {
        limitNum = parseInt(limit);
      }

      const candies = await CandyModel.find()
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum + 1)
        .populate('vendor');

      res.send({
        hasMore: candies.length === limitNum + 1,
        candies: candies.slice(0, limitNum),
      });
    } catch (error) {
      next(error);
    }
  };

  public oneById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id }: z.infer<typeof candyByIdSchema> = req.params;
      const cacheKey = `candy:${id}`;
      const counterKey = `candy:counter:${id}`;
      const cachedCandy = await getCache(cacheKey);
      if (cachedCandy) {
        res.send(cachedCandy);
        return;
      }
      const candy = await CandyModel.findOne({ _id: id });
      if (!candy) {
        res.status(404).send({ message: 'Candy not found' });
        return;
      }
      // Increment the access counter with a TTL of 1 day (86400 seconds)
      const accessCount = await incrementCacheCounter(counterKey, 86400);
      const frequentAccessThreshold = 5; // Configurable threshold
      if (accessCount >= frequentAccessThreshold) {
        // Cache the candy for 1 hour (3600 seconds)
        await setCache(cacheKey, candy, 3600);
      }
      res.send(candy);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description, price, quantity, photo }: z.infer<typeof candyUpdateSchema> = req.body;
      const { id } = req.params;

      const vendorId = req.user._id;

      const foundCandy = await CandyModel.findById(id);

      if (!foundCandy) {
        return next(new HttpException(404, 'Candy does not exist'));
      }
      console.log(foundCandy.vendor.toString());
      console.log(vendorId.toString());

      if (foundCandy.vendor.toString() !== vendorId.toString()) {
        // If the vendor doesn't match, respond with a 403 Forbidden error (Unauthorized)
        return next(new HttpException(403, 'Unauthorized'));
      }

      const candy = await CandyModel.findByIdAndUpdate(id, {
        name,
        price,
        quantity,
        description,
        photo,
      });

      if (candy) {
        await setCache(`candy:${id}`, candy, 3600);
      }
      res.send(candy);
    } catch (error) {
      next(error);
    }
  };
  public create = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description, price, quantity, photo }: z.infer<typeof candySchema> = req.body;

      const vendorId = req.user._id;

      const candy = await CandyModel.create({
        name,
        price,
        quantity,
        description,
        vendor: vendorId,
        photo,
        appId: uuidv4(),
      });

      const candyObj = candy.toObject();
      candyObj.vendor = req.user.appId;

      await producer.connect();
      await producer.send({
        topic: 'candy',
        messages: [{ key: candy.appId, value: JSON.stringify(candyObj) }],
      });

      res.send(candy);
    } catch (error) {
      next(error);
    }
  };

  public vendor = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit }: z.infer<typeof paginatedCandyFetchSchema> = req.query;
      let pageNum;
      let limitNum = parseInt(limit);

      if (!page) {
        pageNum = 1;
      } else {
        pageNum = parseInt(page);
      }

      if (!limit) {
        limitNum = 6;
      } else {
        limitNum = parseInt(limit);
      }

      const candies = await CandyModel.find({ vendor: req.user._id })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum + 1);

      res.send({
        hasMore: candies.length === limitNum + 1,
        candies: candies.slice(0, limitNum),
      });
    } catch (error) {
      next(error);
    }
  };
}

