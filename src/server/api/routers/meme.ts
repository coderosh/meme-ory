import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const memeRouter = createTRPCRouter({
  meme: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return ctx.prisma.meme.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          createdAt: true,
          description: true,
          image: true,
          votes: {
            select: {
              type: true,
              userId: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });
    }),

  // TODO: implement cursor based pagination and (sum of votes after prisma implements it)
  memes: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.meme.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        description: true,
        image: true,
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
      },
    });
  }),

  followingMemes: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.prisma.meme.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        user: {
          followers: { some: { id: userId } },
        },
      },
      select: {
        title: true,
        id: true,
        createdAt: true,
        description: true,
        image: true,
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
      },
    });
  }),

  userMemes: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input: { userId } }) => {
      const memes = await ctx.prisma.meme.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId,
        },
        select: {
          title: true,
          id: true,
          createdAt: true,
          description: true,
          image: true,
          votes: {
            select: {
              type: true,
              userId: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });

      return memes;
    }),

  create: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        image: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input: { description, image, title }, ctx }) => {
      const meme = await ctx.prisma.meme.create({
        data: { description, image, userId: ctx.session.user.id, title },
      });
      return meme;
    }),

  vote: protectedProcedure
    .input(z.object({ type: z.enum(["UP", "DOWN"]), id: z.string() }))
    .mutation(async ({ ctx, input: { id, type } }) => {
      const userId = ctx.session.user.id;
      const userMemeId = { memeId: id, userId: userId };

      const vote = await ctx.prisma.vote.findUnique({
        where: { userId_memeId: userMemeId },
      });

      const voteType = type === "UP" ? 1 : -1;

      if (!vote) {
        await ctx.prisma.vote.create({
          data: { type: voteType, ...userMemeId },
        });
        return { type: voteType };
      } else {
        if (vote.type === voteType) {
          await ctx.prisma.vote.delete({
            where: { userId_memeId: userMemeId },
          });
          return { type: 0 };
        } else {
          await ctx.prisma.vote.update({
            data: { type: voteType },
            where: {
              userId_memeId: userMemeId,
            },
          });
          return { type: voteType };
        }
      }
    }),
});
