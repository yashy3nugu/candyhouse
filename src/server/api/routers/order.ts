import {
  adminProcedure,
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";
import CandyModel from "@/server/models/candy.model";
import CouponModel from "@/server/models/coupon.model";
import OrderModel from "@/server/models/order.model";
import {
  orderInputSchema,
  updateOrderStatusSchema,
} from "@/utils/schemas/order";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
  create: consumerProcedure
    .input(orderInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { items, code, address, bank } = input;

      const candyIds = [...new Set(items.map((item) => item.candy))];

      const candyDocuments = await CandyModel.find({
        _id: {
          $in: candyIds,
        },
      });

      // calculate total server side
      let total = 0;

      for (const candyDocument of candyDocuments) {
        const numItems = items.find((item) => item.candy == candyDocument._id)!.itemsInCart;
        total +=
          candyDocument.price *
          numItems

        if (candyDocument.quantity - numItems < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient stock for candy " + candyDocument._id,
          });
        }
          const updated = await CandyModel.findByIdAndUpdate(candyDocument._id, {
            quantity: candyDocument.quantity - numItems,
          });
        
      }

      if (code) {
        const coupon = await CouponModel.findOne({ code });
        // apply discount
        if (coupon) {
          total -= Math.round((coupon.discount / 100) * total);
        }
      }
      const order = await OrderModel.create({
        user: ctx.user,
        items,
        price: total,
        address,
        bank
      });

      return order;
    }),

  all: adminProcedure
    .input(
      z.object({
        page: z.number().nullish(),
        limit: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      let { page, limit } = input;
      if (!page) page = 1;
      if (!limit) limit = 6;

      const orders = await OrderModel.find()
        .skip((page - 1) * limit)
        .limit(limit + 1)
        .populate("user.name user.email");

      return {
        hasMore: orders.length === limit + 1,
        orders: orders.slice(0, limit),
      };
    }),

  oneById: vendorProcedure
    .input(z.object({ _id: z.string() }))
    .query(async ({ input }) => {
      const order = await OrderModel.findById(input._id).populate(
        "user",
        "name email"
      );

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This order does not exist",
        });
      }

      return order;
    }),
  updateOrderStatus: vendorProcedure
    .input(updateOrderStatusSchema)
    .mutation(async ({ input }) => {
      const { _id, status } = input;

      const order = await OrderModel.findByIdAndUpdate(
        _id,
        {
          $set: { status },
        },
        { new: true }
      ).populate("user", "name email");

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This order does not exist",
        });
      }

      return order;
    }),
});
