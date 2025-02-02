import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const getFeatureRequests = procedure
  .input(z.object({ authToken: z.string() }))
  .query(async ({ input }) => {
    try {
      // Verify the auth token
      jwt.verify(input.authToken, env.JWT_SECRET) as { userId: number };

      // Get all feature requests with their vote counts
      const featureRequests = await db.featureRequest.findMany({
        include: {
          createdBy: {
            select: {
              username: true,
            },
          },
          actions: {
            select: {
              type: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Calculate vote counts, transform the data, and sort by score
      return featureRequests
        .map((request) => {
          const upvotes = request.actions.filter(
            (a) => a.type === "UPVOTE",
          ).length;
          const downvotes = request.actions.filter(
            (a) => a.type === "DOWNVOTE",
          ).length;

          return {
            id: request.id,
            description: request.description,
            createdAt: request.createdAt,
            createdBy: request.createdBy.username,
            score: upvotes - downvotes,
            upvotes,
            downvotes,
          };
        })
        .sort((a, b) => b.score - a.score); // Sort by score in descending order
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid auth token",
      });
    }
  });
