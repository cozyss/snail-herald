import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const sendMessage = procedure
  .input(
    z.object({
      authToken: z.string(),
      receiverUsername: z.string(),
      content: z.string().min(1, "Message cannot be empty"),
    })
  )
  .mutation(async ({ input }) => {
    // First verify the token separately to handle authentication errors
    let decoded;
    try {
      decoded = jwt.verify(input.authToken, JWT_SECRET) as { userId: number };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }

    // Now handle the rest of the logic
    const receiver = await db.user.findUnique({
      where: { username: input.receiverUsername },
    });

    if (!receiver) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Get delay settings
    const delaySettings = await db.delaySetting.findUnique({
      where: { id: 1 },
    });

    // Calculate random delay and visible time
    const minDelay = delaySettings?.minDelay ?? 0;
    const maxDelay = delaySettings?.maxDelay ?? 0;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    const visibleAt = new Date(Date.now() + randomDelay * 1000);

    const message = await db.message.create({
      data: {
        content: input.content,
        senderId: decoded.userId,
        receiverId: receiver.id,
        visibleAt,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return {
      success: true,
      message: "Message sent successfully",
      data: message,
      visibleAt,
    };
  });
