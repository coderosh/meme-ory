import { createTRPCRouter } from "~/server/api/trpc";
import { memeRouter } from "./routers/meme";
import { s3Router } from "./routers/s3";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meme: memeRouter,
  s3: s3Router,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
