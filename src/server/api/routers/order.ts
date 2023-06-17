import { createTRPCRouter, vendorProcedure } from "@/server/api/trpc";
import OrderModel from "@/server/models/order.model";
import { updateOrderStatusSchema } from "@/utils/schemas/order";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
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
