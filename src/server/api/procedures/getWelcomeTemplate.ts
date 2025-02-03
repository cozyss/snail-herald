import { procedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const getWelcomeTemplate = procedure
  .input(z.object({ authToken: z.string() }))
  .query(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };
      
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access welcome template",
        });
      }

      const template = await db.welcomeTemplate.findUnique({
        where: { id: 1 },
      });

      if (!template) {
        // Create default template if it doesn't exist
        return await db.welcomeTemplate.create({
          data: {
            id: 1,
            content: "Welcome to Snail Herald! We're excited to have you join our community. Take your time to explore and enjoy sending letters to others.",
          },
        });
      }

      return template;
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
