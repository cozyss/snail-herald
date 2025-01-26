import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const searchUsers = procedure
  .input(
    z.object({
      authToken: z.string(),
      query: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };

      // Get users that the current user has interacted with (sent to or received from)
      const interactedUsers = await db.user.findMany({
        where: {
          AND: [
            { id: { not: decoded.userId } }, // Exclude the current user
            {
              OR: [
                // Users who have sent messages to the current user
                {
                  sentMessages: {
                    some: {
                      receiverId: decoded.userId
                    }
                  }
                },
                // Users who have received messages from the current user
                {
                  receivedMessages: {
                    some: {
                      senderId: decoded.userId
                    }
                  }
                }
              ]
            },
            // Only apply the search filter if there's a query
            ...(input.query ? [{
              username: { 
                startsWith: input.query,
                mode: 'insensitive'
              }
            }] : [])
          ]
        },
        select: {
          username: true,
        },
        orderBy: {
          username: 'asc'
        },
        take: 10, // Limit results to 10 users
      });

      return interactedUsers.map(user => user.username);
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }
  });
