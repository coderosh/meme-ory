import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const commentSelect = {
  author: {
    select: {
      name: true,
      image: true,
      id: true,
    },
  },
  votes: {
    select: {
      type: true,
      userId: true,
    },
  },
};

export const commentRouter = createTRPCRouter({
  memeComments: publicProcedure
    .input(z.object({ memeId: z.string() }))
    .query(async ({ ctx, input: { memeId } }) => {
      return ctx.prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          memeId,
          parentId: null,
        },
        include: {
          ...commentSelect,
          replies: {
            orderBy: { createdAt: "desc" },
            include: {
              ...commentSelect,
              replies: {
                orderBy: { createdAt: "desc" },
                include: {
                  ...commentSelect,
                },
              },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        memeId: z.string(),
        parentId: z.string().nullable(),
      })
    )
    .mutation(async ({ input: { text, memeId, parentId }, ctx }) => {
      const authorId = ctx.session.user.id;

      const comment = await ctx.prisma.comment.create({
        data: { text, memeId, authorId, parentId },
      });

      return comment;
    }),

  vote: protectedProcedure
    .input(z.object({ type: z.enum(["UP", "DOWN"]), id: z.string() }))
    .mutation(async ({ ctx, input: { id, type } }) => {
      const userId = ctx.session.user.id;
      const userCommentId = { commentId: id, userId: userId };

      const vote = await ctx.prisma.commentVote.findUnique({
        where: { userId_commentId: userCommentId },
      });

      const voteType = type === "UP" ? 1 : -1;

      if (!vote) {
        await ctx.prisma.commentVote.create({
          data: { type: voteType, ...userCommentId },
        });
        return { type: voteType };
      } else {
        if (vote.type === voteType) {
          await ctx.prisma.commentVote.delete({
            where: { userId_commentId: userCommentId },
          });
          return { type: 0 };
        } else {
          await ctx.prisma.commentVote.update({
            data: { type: voteType },
            where: {
              userId_commentId: userCommentId,
            },
          });
          return { type: voteType };
        }
      }
    }),
});
