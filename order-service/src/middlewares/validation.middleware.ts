import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const ValidateBody = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const ValidateParams = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.params);
    return next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const ValidateQuery = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.query);
    return next();
  } catch (error) {
    return res.status(400).json(error);
  }
};
