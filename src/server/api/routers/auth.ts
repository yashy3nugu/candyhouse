import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {UserModel} from "@/server/models/user.model";

import { TRPCError } from "@trpc/server";
import * as jwt from "@/server/lib/jwt";
import { Cookie } from "next-cookie";
import { loginInputSchema, registerInputSchema } from "@/utils/schemas/auth";
import CandyModel from "@/server/models/candy.model";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const user = await UserModel.findOne({
        email,
      }).select("+password");

      if (!user || !(await user.checkPassword(password, user.password))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Credentials",
        });
      }

      jwt.signToken({ user }, ctx.req, ctx.res);

      return user;
    }),
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password, role } = input;
      
      // console.log(input);
      const user = await UserModel.create({
        name,
        email,
        password,
        role,
      });



      jwt.signToken({ user }, ctx.req, ctx.res);

      return user;
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookie = Cookie.fromApiRoute(ctx.req, ctx.res);
    cookie.remove("burgerHouse");
    return true;
  }),
  user: publicProcedure.query(({ ctx }) => {
    return ctx.user || null;
  }),
});
