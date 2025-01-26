import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

// Convert days to seconds
const SECONDS_IN_DAY = 86400;

export const getDelaySettings = procedure
  .input(
    z.object({
      authToken: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };

      // Check if user is admin
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access delay settings",
        });
      }

      // Get or create delay settings
      let settings = await db.delaySetting.findUnique({
        where: { id: 1 },
      });

      if (!settings) {
        settings = await db.delaySetting.create({
          data: {
            id: 1,
            minDelay: 0,
            maxDelay: 0,
          },
        });
      }

      // Convert seconds to days for display
      return {
        ...settings,
        minDelay: settings.minDelay / SECONDS_IN_DAY,
        maxDelay: settings.maxDelay / SECONDS_IN_DAY,
      };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
