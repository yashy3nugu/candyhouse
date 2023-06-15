import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";


import CandyModel from "@/server/models/candy.model";

export const candyRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        page: z.number().nullish(),
        limit: z.number().nullish(),
        
      })
    )
    .query(({ input }) => {
    //   let { page, limit } = input;
      
    //   if (!page) page = 1;
    //   if (!limit) limit = 6;

    //   const candies = await CandyModel.find()
    //     .skip((page - 1) * limit)
    //     .limit(limit + 1);

    //   return {
    //     hasMore: candies.length === limit + 1,
    //     candies: candies.slice(0, limit),
    //   };
        return input;
    }),

});
