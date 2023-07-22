import { z } from "zod";
import { v4 as uuid } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { env } from "~/env.mjs";
import { protectedProcedure, createTRPCRouter } from "../trpc";

const UPLOAD_MAX_FILE_SIZE = 1000000;

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export const s3Router = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const imageId = `${uuid()}-${input.name}`;

      return createPresignedPost(s3Client, {
        Bucket: env.S3_BUCKET,
        Key: imageId,
        Fields: {
          key: imageId,
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),
});
