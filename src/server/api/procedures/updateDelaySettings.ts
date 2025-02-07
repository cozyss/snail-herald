import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

// Convert minutes to seconds
const SECONDS_IN_MINUTE = 60;

export const updateDelaySettings = procedure
  .input(
    z.object({
      authToken: z.string(),
      minDelay: z.number().int().min(0),
      maxDelay: z.number().int().min(0),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };

      // Check if user is admin
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update delay settings",
        });
      }

      if (input.minDelay > input.maxDelay) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Minimum delay cannot be greater than maximum delay",
        });
      }

      // Convert minutes to seconds for storage
      const minDelaySeconds = input.minDelay * SECONDS_IN_MINUTE;
      const maxDelaySeconds = input.maxDelay * SECONDS_IN_MINUTE;

      const settings = await db.delaySetting.upsert({
        where: { id: 1 },
        create: {
          minDelay: minDelaySeconds,
          maxDelay: maxDelaySeconds,
        },
        update: {
          minDelay: minDelaySeconds,
          maxDelay: maxDelaySeconds,
        },
      });

      return {
        success: true,
        message: "Delay settings updated successfully",
        data: {
          ...settings,
          minDelay: settings.minDelay / SECONDS_IN_MINUTE,
          maxDelay: settings.maxDelay / SECONDS_IN_MINUTE,
        },
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
