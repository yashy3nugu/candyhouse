import { HttpException } from '@/exceptions/httpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { producer } from '@/lib/kafka';
import CandyModel from '@/models/candy.model';
import CouponModel from '@/models/coupon.model';
import OrderModel from '@/models/order.model';
import { UserModel } from '@/models/user.model';
import { orderByIdSchema, orderInputSchema, paginatedOrderFetchSchema } from '@/utils/schemas/order';
import { Status } from '@/utils/types/order';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

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
      const { items, address, bank, code, coinsToRedeem }: z.infer<typeof orderInputSchema> = req.body;
      // res.send(req.body);
      // return;

      session.startTransaction();
      const candyIds = [...new Set(items.map(item => item.candy))];
      console.log('got candy ids');
      // calculate total server side
      let total = 0;

      for (const x of items) {
        total += x.price * x.itemsInCart;
      }

      const candyDocuments = await CandyModel.find({
        appId: {
          $in: candyIds,
        },
      });

      for (const candyDocument of candyDocuments) {
        const numItems = items.find(item => item.candy == candyDocument.appId)!.itemsInCart;
        // total += candyDocument.price * numItems;

        if (candyDocument.quantity - numItems < 0) {
          // throw new TRPCError({
          //   code: 'BAD_REQUEST',
          //   message: 'Insufficient stock for candy ' + candyDocument._id,
          // });
          throw new HttpException(400, 'Insufficient stock for candy ' + candyDocument.name);
        }
        // const updated = await CandyModel.findByIdAndUpdate(candyDocument._id, {
        //   quantity: candyDocument.quantity - numItems,
        // });
      }

      // bulk write (the case where insuficcient stock is present is taken care during total calculation)
      const candyQuantityUpdates = items.map(orderItem => ({
        key: orderItem.candy,
        value: JSON.stringify({ quantity: -orderItem.itemsInCart }),
      }));

      // await CandyModel.bulkWrite(candyQuantityUpdates);

      // let coupon = null;
      // if (code) {
      //   coupon = await CouponModel.findOne({ code });
      //   // apply discount
      //   if (coupon) {
      //     if (coupon.redeemed.includes(new mongoose.Types.ObjectId(req.user._id))) {
      //       throw new HttpException(400, 'Invalid Coupon Code');
      //     }

      //     total -= Math.round((coupon.discount / 100) * total);
      //   } else {
      //     // throw new TRPCError({
      //     //   code: 'BAD_REQUEST',
      //     //   message: 'Invalid coupon code',
      //     // });
      //     throw new HttpException(400, 'Invalid Coupon Code');
      //   }

      //   await CouponModel.findByIdAndUpdate(coupon._id, {
      //     $addToSet: {
      //       redeemed: req.user._id,
      //     },
      //   });
      // }

      // let coinDiscount = 0;
      // if (coinsToRedeem > 0) {
      //   if (coinsToRedeem <= req.user.balance) {
      //     const coinsDiscountAmount = Math.floor(coinsToRedeem / 10) * 10; // 1 coin for every 10 rupees
      //     coinDiscount = coinsDiscountAmount / 10; // 10 rupees for every 100 coins

      //     await UserModel.findByIdAndUpdate(req.user._id, {
      //       $inc: {
      //         balance: -coinsToRedeem,
      //         totalRedeemedCoins: coinsToRedeem,
      //       },
      //     });
      //   } else {
      //     // throw new TRPCError({
      //     //   code: 'BAD_REQUEST',
      //     //   message: 'Insufficient coin balance',
      //     // });
      //     throw new HttpException(400, 'Insufficient coin balance');
      //   }
      // }

      // if (total - coinDiscount < 0) {
      //   // throw new TRPCError({
      //   //   code: 'BAD_REQUEST',
      //   //   message: 'Redeemed coins are more than order total',
      //   // });
      //   throw new HttpException(400, 'Redeemed coins are more than order total');
      // }
      // // Apply the coin discount to the total
      // total -= coinDiscount;

      const order = await OrderModel.create({
        user: req.user._id,
        items,
        price: total,
        address,
        bank,
        coinsRedeemed: 0,
      });

      // const coinsEarned = Math.floor(total / 10);

      // const user = await UserModel.findByIdAndUpdate(req.user._id, {
      //   $inc: {
      //     balance: coinsEarned,
      //     totalEarnedCoins: coinsEarned,
      //   },
      // });

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

      console.log(error);
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
}
