import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";


import CandyModel from "@/server/models/candy.model";
import candySchema from "@/utils/schemas/candy";

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
  
  create: vendorProcedure.input(candySchema).mutation(async ({input, ctx}) => {
    const { name, description, price, quantity, photo } = input;

    

    console.log(input)

    const candy = await CandyModel.create({
      name,
      price,
      quantity,
      description,
      vendor: ctx.user._id,
      photo
    })
   
    return candy;

  })

});
