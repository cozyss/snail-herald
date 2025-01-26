import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const getUserMessages = procedure
  .input(
    z.object({
      authToken: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };

      const [sentMessages, receivedMessages] = await Promise.all([
        db.message.findMany({
          where: {
            senderId: decoded.userId,
          },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
            receiver: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        db.message.findMany({
          where: {
            receiverId: decoded.userId,
            visibleAt: {
              lte: new Date(),
            },
          },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
            receiver: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return {
        sentMessages,
        receivedMessages,
      };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
