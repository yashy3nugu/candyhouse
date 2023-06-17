import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { candyRouter } from "./routers/candy";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  candy: candyRouter,
  order: orderRouter
})

// export type definition of API
export type AppRouter = typeof appRouter;
