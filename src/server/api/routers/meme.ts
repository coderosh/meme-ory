import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const memeSelect = {
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
};

export const memeRouter = createTRPCRouter({
  meme: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return ctx.prisma.meme.findUnique({
        where: { id },
        select: memeSelect,
      });
    }),

  // TODO: implement cursor based pagination and (sum of votes after prisma implements it)
  memes: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ ctx, input: { limit = 8, cursor } }) => {
      const memes = await ctx.prisma.meme.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: memeSelect,
      });

      let nextCursor: typeof cursor;

      if (memes.length > limit) {
        const meme = memes.pop();
        if (meme) {
          nextCursor = { id: meme.id, createdAt: meme.createdAt };
        }
      }

      return { memes, nextCursor };
    }),

  followingMemes: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ ctx, input: { limit = 8, cursor } }) => {
      const userId = ctx.session.user.id;

      const memes = await ctx.prisma.meme.findMany({
        where: {
          user: {
            followers: { some: { id: userId } },
          },
        },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: memeSelect,
      });

      let nextCursor: typeof cursor;

      if (memes.length > limit) {
        const meme = memes.pop();
        if (meme) {
          nextCursor = { id: meme.id, createdAt: meme.createdAt };
        }
      }

      return { memes, nextCursor };
    }),

  userMemes: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ ctx, input: { userId, limit = 8, cursor } }) => {
      const memes = await ctx.prisma.meme.findMany({
        where: {
          userId,
        },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: memeSelect,
      });

      let nextCursor: typeof cursor;

      if (memes.length > limit) {
        const meme = memes.pop();
        if (meme) {
          nextCursor = { id: meme.id, createdAt: meme.createdAt };
        }
      }

      return { memes, nextCursor };
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
