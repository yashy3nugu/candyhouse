import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";

import CandyModel from "@/server/models/candy.model";
import candySchema, { candyUpdateSchema } from "@/utils/schemas/candy";
import { TRPCError } from "@trpc/server";

export const candyRouter = createTRPCRouter({
  all: publicProcedure
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

      const candies = await CandyModel.find()
        .skip((page - 1) * limit)
        .limit(limit + 1)
        .populate("vendor");

      return {
        hasMore: candies.length === limit + 1,
        candies: candies.slice(0, limit),
      };
    }),

  create: vendorProcedure
    .input(candySchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description, price, quantity, photo } = input;

      const candy = await CandyModel.create({
        name,
        price,
        quantity,
        description,
        vendor: ctx.user._id,
        photo,
      });

      return candy;
    }),

  oneById: publicProcedure
    .input(
      z.object({
        id: z.string({ required_error: "Candy Id required" }),
      })
    )
    .query(async ({ input }) => {
      console.log("input", input);
      const { id } = input;

      const candy = await CandyModel.findOne({ _id: id }).populate("vendor");
      if (!candy) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This candy does not exist",
        });
      }
      return candy;
    }),
  update: vendorProcedure
    .input(candyUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description, price, quantity, photo, _id } = input;
      
      const candy = await CandyModel.findByIdAndUpdate(_id, {
        name,
        price,
        quantity,
        description,
        vendor: ctx.user._id,
        photo,
      });

      return candy;
    }),
});
