import {
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";
import BankModel from "@/server/models/bank.model";
import CandyModel from "@/server/models/candy.model";
import CouponModel from "@/server/models/coupon.model";
import OrderModel from "@/server/models/order.model";
import ReviewModel from "@/server/models/review.model";
import {
  orderInputSchema,
  updateOrderStatusSchema,
} from "@/utils/schemas/order";
import { reviewInputSchema } from "@/utils/schemas/review";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const couponRouter = createTRPCRouter({
  create: publicProcedure.input(z.object({})).mutation(async ({}) => {
    const coupon = await CouponModel.create({
      bank: "6490029c4171141d2869e383",
      code: "HDFC12",
      name: "HDFC discount",
      discount: 20,
    });

    return coupon;
  }),

  validate: consumerProcedure
    .input(
      z.object({
        code: z.string(),
        bank: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { code, bank } = input;
      const coupon = await CouponModel.findOne({
        code,
      }).populate("bank");

      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Coupon with code ${code} not found`,
        });
      }

      // const bankDocument = await BankModel.findById({ id: bank });

      if (!coupon.bank._id.equals(bank)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Coupon not applicable for this bank`,
        });
      }

      return { coupon };
    }),
});
