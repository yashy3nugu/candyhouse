/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { connectDB } from "@/server/lib/mongoose";
import { User } from "@/server/models/user.model";
import UserModel from "@/server/models/user.model";
import { Cookie } from "next-cookie";
import * as jwt from "@/server/lib/jwt";
import { Role } from "@/utils/types/user";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = {
  session: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = () => {
  return {};
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  await connectDB();

  return {
    req,
    res,
    user: null as User | null,
    // user: null
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

export const parseCookie = t.middleware(async ({ ctx, next }) => {
  console.log("parsing cookie");
  const cookie = Cookie.fromApiRoute(ctx.req, ctx.res);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const token = cookie.get("candyHouse") as string;

  if (!token) return next();

  const payload = jwt.decodeToken(token) as { _id: string };

  if (!payload) {
    cookie.remove("burgerHouse");
    return next();
  }

  const user = await UserModel.findById(payload._id).select("+password");

  if (!user) return next();

  // ctx.user = user;
  console.log("parsed cookie");

  return next({ ctx });
});

const protectRoute = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// const adminRoute = t.middleware(async ({ ctx, next }) => {
//   if (ctx.user?.role !== Role.Admin) {
//     throw new TRPCError({
//       code: "FORBIDDEN",
//       message: "You are not authorized to perform this action",
//     });
//   }

//   return next({
//     ctx: {
//       user: ctx.user,
//     },
//   });
// });

export const publicProcedure = t.procedure;
// .use(parseCookie);
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
// export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
