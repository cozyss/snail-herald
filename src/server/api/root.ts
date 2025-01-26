import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { registerUser } from "./procedures/registerUser";
import { loginUser } from "./procedures/loginUser";
import { sendMessage } from "./procedures/sendMessage";
import { getUserMessages } from "./procedures/getUserMessages";
import { getAllUserStats } from "./procedures/getAllUserStats";
import { getDelaySettings } from "./procedures/getDelaySettings";
import { updateDelaySettings } from "./procedures/updateDelaySettings";
import { searchUsers } from "./procedures/searchUsers";
import { markMessageAsRead } from "./procedures/markMessageAsRead";
import { markAllMessagesAsRead } from "./procedures/markAllMessagesAsRead";

export const appRouter = createTRPCRouter({
  registerUser,
  loginUser,
  sendMessage,
  getUserMessages,
  getAllUserStats,
  getDelaySettings,
  updateDelaySettings,
  searchUsers,
  markMessageAsRead,
  markAllMessagesAsRead,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
