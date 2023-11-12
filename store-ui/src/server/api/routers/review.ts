import {
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import ReviewModel from "@/server/models/review.model";


import { reviewInputSchema } from "@/utils/schemas/review";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewRouter = createTRPCRouter({
  create: consumerProcedure
    .input(reviewInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { candy, description, rating } = input;

      const existingReview = await ReviewModel.find({
        candy,
        reviewer: ctx.user._id,
      });

      if (existingReview) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has already provided a review for this candy",
        });
      }

      const review = await ReviewModel.create({
        candy,
        description,
        rating,
        reviewer: ctx.user._id,
      });

      return review;
    }),

  allByCandyId: publicProcedure.input(z.object({id: z.string()})).query(async ({ input }) => {
    const reviews = await ReviewModel.find({
      candy: input.id
    }).populate(
      "reviewer",
      "name"
    );

    if (reviews.length === 0) {
      return { reviews, averageRating: 0 };
    }
    const averageRating =
      reviews.reduce((accumulator, review) => accumulator + review.rating, 0) /
      reviews.length;

    return { reviews, averageRating };
  }),
});
