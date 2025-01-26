import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const markAllMessagesAsRead = procedure
  .input(
    z.object({
      authToken: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };

      // Update all unread messages where the user is the receiver and the message is visible
      await db.message.updateMany({
        where: {
          receiverId: decoded.userId,
          isRead: false,
          visibleAt: {
            lte: new Date(),
          },
        },
        data: {
          isRead: true,
        },
      });

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
