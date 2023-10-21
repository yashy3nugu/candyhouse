import {
  adminProcedure,
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";
import BankModel from "@/server/models/bank.model";
import { bankUpdateSchema } from "@/utils/schemas/bank";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const bankRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({})).query(async ({}) => {
    const banks = await BankModel.find({});

    return { banks };
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Bank name is required" }).min(2),
      })
    )
    .query(async ({ input }) => {
      const { name } = input;
      const bank = await BankModel.create({ name });

      return bank;
    }),

  changeStatus: adminProcedure
    .input(
      bankUpdateSchema
    )
    .query(async ({ input }) => {
      const { status, _id } = input;
      const bank = await BankModel.findByIdAndUpdate(_id, {
        status
      });

      if (!bank) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bank not found"
        })
      }

      return bank;
    }),
});
