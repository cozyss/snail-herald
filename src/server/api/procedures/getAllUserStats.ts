import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const getAllUserStats = procedure
  .input(z.object({ authToken: z.string() }))
  .query(async ({ input }) => {
    try {
      const verified = jwt.verify(input.authToken, JWT_SECRET);
      const parsed = z.object({ userId: z.number() }).parse(verified);

      const requestingUser = await db.user.findUnique({
        where: { id: parsed.userId },
      });

      if (!requestingUser?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access this information",
        });
      }

      const users = await db.user.findMany({
        select: {
          id: true,
          username: true,
          createdAt: true,
          isAdmin: true,
          _count: {
            select: {
              sentMessages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users.map((user) => ({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
        messageCount: user._count.sentMessages,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
