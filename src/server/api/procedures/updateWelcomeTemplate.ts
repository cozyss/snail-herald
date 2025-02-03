import { procedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const updateWelcomeTemplate = procedure
  .input(
    z.object({
      authToken: z.string(),
      content: z.string().min(1, "Welcome message cannot be empty"),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };
      
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update welcome template",
        });
      }

      const template = await db.welcomeTemplate.upsert({
        where: { id: 1 },
        update: {
          content: input.content,
          updatedAt: new Date(),
        },
        create: {
          id: 1,
          content: input.content,
        },
      });

      return {
        success: true,
        template,
      };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
