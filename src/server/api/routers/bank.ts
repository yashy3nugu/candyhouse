import {
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";
import BankModel from "@/server/models/bank.model";
import { z } from "zod";

export const bankRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({})).query(async ({}) => {
    const banks = await BankModel.find({});

    return {banks};
  }),
});
