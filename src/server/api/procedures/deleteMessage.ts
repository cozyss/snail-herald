import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const deleteMessage = procedure
  .input(
    z.object({
      authToken: z.string(),
      messageId: z.number(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      // Verify the auth token
      const decoded = jwt.verify(input.authToken, env.JWT_SECRET) as {
        userId: number;
      };

      // Get the message and check if user has permission to delete it
      const message = await db.message.findUnique({
        where: { id: input.messageId },
        include: {
          sender: {
            select: { id: true },
          },
          receiver: {
            select: { id: true },
          },
        },
      });

      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }

      // Check if the user is either the sender or receiver
      if (message.sender.id !== decoded.userId && message.receiver.id !== decoded.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this message",
        });
      }

      // Delete the message
      await db.message.delete({
        where: { id: input.messageId },
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
