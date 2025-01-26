import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { procedure } from "@/server/api/trpc";
import bcrypt from "bcryptjs";
import { env } from "@/env";

export const registerUser = procedure
  .input(
    z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      secretAnswer: z.string().refine(
        (answer) => answer.toLowerCase() === env.SECRET_ANSWER.toLowerCase(),
        {
          message: "Incorrect answer to the security question",
        }
      ),
    })
  )
  .mutation(async ({ input }) => {
    const existingUser = await db.user.findUnique({
      where: { username: input.username },
    });

    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    await db.user.create({
      data: {
        username: input.username,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  });
