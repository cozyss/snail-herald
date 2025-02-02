import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const sendAnnouncement = procedure
  .input(
    z.object({
      authToken: z.string(),
      content: z.string().min(1, "Announcement cannot be empty"),
    })
  )
  .mutation(async ({ input }) => {
    // Verify the token and get admin user
    let decoded;
    try {
      decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }

    // Check if user is admin
    const admin = await db.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!admin?.isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can send announcements",
      });
    }

    // Get all users except the admin
    const users = await db.user.findMany({
      where: {
        id: {
          not: decoded.userId,
        },
      },
    });

    // Create messages for all users - announcements are immediately visible
    const messages = await Promise.all(
      users.map(async (user) => {
        return db.message.create({
          data: {
            content: input.content,
            senderId: decoded.userId,
            receiverId: user.id,
            visibleAt: new Date(), // Immediately visible
            isAnnouncement: true, // Set this to true for announcements
          },
          include: {
            sender: true,
            receiver: true,
          },
        });
      })
    );

    return {
      success: true,
      message: `Announcement sent to ${messages.length} users`,
      data: messages,
    };
  });
