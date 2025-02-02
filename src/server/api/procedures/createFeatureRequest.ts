import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const createFeatureRequest = procedure
  .input(
    z.object({
      authToken: z.string(),
      description: z.string().min(1),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      // Verify the auth token
      const decoded = jwt.verify(input.authToken, env.JWT_SECRET) as {
        userId: number;
      };

      // Get user to check admin status
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: { isAdmin: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Only check action points for non-admin users
      if (!user.isAdmin) {
        // Check if user has remaining action points for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const actionsToday = await db.featureAction.count({
          where: {
            userId: decoded.userId,
            createdAt: {
              gte: today,
            },
          },
        });

        if (actionsToday >= 5) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You have used all your action points for today",
          });
        }
      }

      // Create the feature request and record the action
      const featureRequest = await db.featureRequest.create({
        data: {
          description: input.description,
          createdById: decoded.userId,
          actions: {
            create: {
              type: "CREATE",
              userId: decoded.userId,
            },
          },
        },
      });

      return {
        success: true,
        featureRequest,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error(error, error.stack);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid auth token",
      });
    }
  });
