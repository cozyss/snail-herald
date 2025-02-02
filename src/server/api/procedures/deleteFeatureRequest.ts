import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const deleteFeatureRequest = procedure
  .input(
    z.object({
      authToken: z.string(),
      featureRequestId: z.number(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      // Verify the auth token
      const decoded = jwt.verify(input.authToken, env.JWT_SECRET) as {
        userId: number;
      };

      // Check if user is admin
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: { isAdmin: true },
      });

      if (!user?.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete feature requests",
        });
      }

      // Delete the feature request and all associated actions
      await db.featureAction.deleteMany({
        where: { featureRequestId: input.featureRequestId },
      });

      await db.featureRequest.delete({
        where: { id: input.featureRequestId },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid auth token",
      });
    }
  });
