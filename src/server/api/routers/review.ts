import {
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";
import CandyModel from "@/server/models/candy.model";
import OrderModel from "@/server/models/order.model";
import ReviewModel from "@/server/models/review.model";
import {
  orderInputSchema,
  updateOrderStatusSchema,
} from "@/utils/schemas/order";
import { reviewInputSchema } from "@/utils/schemas/review";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewRouter = createTRPCRouter({
  create: consumerProcedure
    .input(reviewInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { candy, description, rating } = input;

      const review = await ReviewModel.create({
        candy,
        description,
        rating,
        reviewer: ctx.user._id,
      });
    }),

  all: vendorProcedure
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
});
