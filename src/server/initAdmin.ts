import { db } from "./db";
import { env } from "@/env";
import bcrypt from "bcryptjs";

export async function initializeAdminUser() {
  const existingAdmin = await db.user.findUnique({
    where: { username: env.APP_USERNAME },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(env.APP_PASSWORD, 10);
    await db.user.create({
      data: {
        username: env.APP_USERNAME,
        password: hashedPassword,
        isAdmin: true,
      },
    });
    console.log("Admin user created successfully");
  }

  // Initialize delay settings if they don't exist
  const existingSettings = await db.delaySetting.findUnique({
    where: { id: 1 },
  });

  if (!existingSettings) {
    await db.delaySetting.create({
      data: {
        id: 1,
        minDelay: 0,
        maxDelay: 0,
      },
    });
    console.log("Delay settings initialized successfully");
  }
}
