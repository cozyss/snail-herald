import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const markMessageAsRead = procedure
  .input(
    z.object({
      authToken: z.string(),
      messageId: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };

      // Find the message and make sure it belongs to the user
      const message = await db.message.findFirst({
        where: {
          id: input.messageId,
          receiverId: decoded.userId,
        },
      });

      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found or you don't have permission to access it",
        });
      }

      // Update the message to mark it as read
      await db.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          isRead: true,
        },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
