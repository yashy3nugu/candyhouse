import { NextFunction, Request, Response } from "express";

export type ExpressResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export type Context = {
  req: Request;
  res: Response;
};
