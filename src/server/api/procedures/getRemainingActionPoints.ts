import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const getRemainingActionPoints = procedure
  .input(
    z.object({
      authToken: z.string(),
    }),
  )
  .query(async ({ input }) => {
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

      // Admin users have unlimited action points
      if (user.isAdmin) {
        return { points: "∞" };
      }

      // Count actions for today for non-admin users
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

      return { points: Math.max(0, 5 - actionsToday) };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid auth token",
      });
    }
  });
