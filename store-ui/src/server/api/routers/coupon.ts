// import {
//   createTRPCRouter,
//   publicProcedure,
// } from "@/server/api/trpc";
// import CouponModel from "@/server/models/coupon.model";


// import { TRPCError } from "@trpc/server";
// import { z } from "zod";

// export const couponRouter = createTRPCRouter({
//   create: publicProcedure.input(z.object({})).mutation(async ({}) => {
//     const coupon = await CouponModel.create({
//       bank: "6490029c4171141d2869e383",
//       code: "HDFC12",
//       name: "HDFC discount",
//       discount: 20,
//     });

//     return coupon;
//   }),

//   validate: publicProcedure
//     .input(
//       z.object({
//         code: z.string(),
//         bank: z.string(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const { code, bank } = input;
//       const coupon = await CouponModel.findOne({
//         code,
//       }).populate("bank");

//       if (!coupon) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: `Coupon with code ${code} not found`,
//         });
//       }

//       // const bankDocument = await BankModel.findById({ id: bank });

//       if (!coupon.bank._id.equals(bank)) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: `Coupon not applicable for this bank`,
//         });
//       }

//       return { coupon };
//     }),
// });
