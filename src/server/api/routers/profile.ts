import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          _count: {
            select: {
              followers: true,
              follows: true,
              memes: true,
            },
          },
          name: true,
          image: true,
          followers: true,
        },
      });
    }),

  follow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const userId = ctx.session.user.id;

      const follow = await ctx.prisma.user.findFirst({
        where: { id, followers: { some: { id: userId } } },
      });

      if (follow) {
        await ctx.prisma.user.update({
          where: { id },
          data: { followers: { disconnect: { id: userId } } },
        });
        return { follow: true };
      } else {
        await ctx.prisma.user.update({
          where: { id },
          data: { followers: { connect: { id: userId } } },
        });
        return { follow: false };
      }
    }),
});
