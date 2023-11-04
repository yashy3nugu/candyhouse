import { HttpException } from '@/exceptions/httpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import CandyModel from '@/models/candy.model';
import CouponModel from '@/models/coupon.model';
import OrderModel from '@/models/order.model';
import { UserModel } from '@/models/user.model';
import { orderInputSchema } from '@/utils/schemas/order';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

export class OrderController {
  public test = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send('test');
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
      // const candyQuantityUpdates = items.map(orderItem => ({
      //   updateOne: {
      //     filter: { _id: orderItem.candy.toString() },
      //     update: {
      //       $inc: { quantity: -orderItem.itemsInCart },
      //     },
      //   },
      // }));

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

      res.send(order);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.log(error);
      next(error);
    }
  };
}
