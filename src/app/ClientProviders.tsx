"use client";

import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "@/trpc/react";
import { TranslationProvider } from "@/utils/i18n";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <TranslationProvider>
        {children}
        <Toaster />
      </TranslationProvider>
    </TRPCReactProvider>
  );
}
