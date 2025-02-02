import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

// Convert hours to seconds
const SECONDS_IN_HOUR = 3600;

export const getDelaySettings = procedure
  .input(
    z.object({
      authToken: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      // Verify token is valid but don't check for admin
      jwt.verify(input.authToken, JWT_SECRET);

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

      // Convert seconds to hours for display
      return {
        ...settings,
        minDelay: settings.minDelay / SECONDS_IN_HOUR,
        maxDelay: settings.maxDelay / SECONDS_IN_HOUR,
      };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
