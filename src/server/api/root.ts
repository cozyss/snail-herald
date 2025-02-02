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
import { sendAnnouncement } from "./procedures/sendAnnouncement";
import { getFeatureRequests } from "./procedures/getFeatureRequests";
import { createFeatureRequest } from "./procedures/createFeatureRequest";
import { voteOnFeature } from "./procedures/voteOnFeature";
import { deleteFeatureRequest } from "./procedures/deleteFeatureRequest";
import { getRemainingActionPoints } from "./procedures/getRemainingActionPoints";

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
  sendAnnouncement,
  getFeatureRequests,
  createFeatureRequest,
  voteOnFeature,
  deleteFeatureRequest,
  getRemainingActionPoints,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
