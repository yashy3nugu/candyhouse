import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { producer } from '@/lib/kafka';
import CandyModel from '@/models/candy.model';
import CouponModel from '@/models/coupon.model';
import OrderModel from '@/models/order.model';
import { UserModel } from '@/models/user.model';
import { orderByIdSchema, orderInputSchema, orderUpdateSchema, orderConfirmSchema, paginatedOrderFetchSchema } from '@/utils/schemas/order';
import { Status } from '@/utils/types/order';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import Stripe from 'stripe';

export class OrderController {
  public allForAdmin = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit }: z.infer<typeof paginatedOrderFetchSchema> = req.query;
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
      const orders = await OrderModel.find()
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum + 1);

      res.send({
        hasMore: orders.length === limitNum + 1,
        orders: orders.slice(0, limitNum),
      });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    try {
      const { items, address }: z.infer<typeof orderInputSchema> = req.body;
      // Calculate total
      let total = 0;
      for (const x of items) {
        total += x.price * x.itemsInCart;
      }
      // Create Stripe PaymentIntent
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: {
          address,
          userId: req.user._id.toString(),
        },
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      next(error);
    }
  };

  public getOrdersOfUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit }: z.infer<typeof paginatedOrderFetchSchema> = req.query;
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

      const orders = await OrderModel.find({ user: req.user._id })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum + 1);

      res.send({
        hasMore: orders.length === limitNum + 1,
        orders: orders.slice(0, limitNum),
      });

      //******************************************* */
    } catch (error) {
      next(error);
    }
  };

  public oneById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id }: z.infer<typeof orderByIdSchema> = req.params;

      const order = await OrderModel.findOne({ _id: id });

      if (!order) {
        throw new HttpException(404, 'Order not found');
      }

      res.send(order);
    } catch (error) {
      next(error);
    }
  };

  public cancel = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { id }: z.infer<typeof orderByIdSchema> = req.params;

      const order = await OrderModel.findOne({ _id: id });

      if (!order) {
        throw new HttpException(404, 'order not found');
      }

      if (order.status === Status.Cancelled) {
        throw new HttpException(400, 'Order is already cancelled');
      }

      const updated = await OrderModel.findByIdAndUpdate(id, {
        status: Status.Cancelled,
      });

      const candyQuantityUpdates = order.items.map(orderItem => ({
        key: orderItem.candy,
        value: JSON.stringify({ quantity: orderItem.itemsInCart }),
      }));

      await session.commitTransaction();
      session.endSession();

      // await producer.connect();
      // await producer.send({
      //   topic: 'quantity',
      //   messages: candyQuantityUpdates,
      // });

      res.send(order);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };

  public update = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { address, bank, items, status }: z.infer<typeof orderUpdateSchema> = req.body;

      const { id } = req.params;

      const order = await OrderModel.findByIdAndUpdate(id, { address, bank, items, status });
      res.send(order);
    } catch (error) {
      next(error);
    }
  };

  public confirmAndCreate = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    try {
      const { paymentIntentId, items, address }: z.infer<typeof orderConfirmSchema> = req.body;
      console.log('called confirmAndCreate');

      // Transform items: ensure appId is mapped to candy
      const transformedItems = items.map(item => ({
        ...item,
        candy: item.candy || item.appId, // Use candy if present, otherwise use appId
      }));
      // Verify payment status with Stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        res.status(400).json({ error: 'Payment not confirmed' });
        return;
      }
      // Inventory and order creation logic (copied from previous create logic)
      session.startTransaction();
      const candyIds = [...new Set(transformedItems.map(item => item.candy))];
      const candyDocuments = await CandyModel.find({
        appId: {
          $in: candyIds,
        },
      });
      for (const candyDocument of candyDocuments) {
        const numItems = transformedItems.find(item => item.candy == candyDocument.appId)!.itemsInCart;
        if (candyDocument.quantity - numItems < 0) {
          throw new HttpException(400, 'Insufficient stock for candy ' + candyDocument.name);
        }
      }
      const candyQuantityUpdates = transformedItems.map(orderItem => ({
        key: orderItem.candy,
        value: JSON.stringify({ quantity: -orderItem.itemsInCart }),
      }));
      // let total = 0;
      // for (const x of items) {
      //   total += x.price * x.itemsInCart;
      // }
      const order = await OrderModel.create({
        user: req.user._id,
        items: transformedItems,
        price: paymentIntent.amount / 100, // Stripe amount is in cents (dollars now)
        address,
        coinsRedeemed: 0,
      });
      await session.commitTransaction();
      session.endSession();
      await producer.connect();
      await producer.send({
        topic: 'quantity',
        messages: candyQuantityUpdates,
      });
      res.send(order);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  };
}
