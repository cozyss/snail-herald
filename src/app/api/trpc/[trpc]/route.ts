import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({
      headers: req.headers,
    }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
    responseMeta() {
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Request-Method": "*",
          "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
          "Access-Control-Allow-Headers": "*",
        },
      };
    },
  });

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
