import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "@/trpc/react";
import { LanguageProvider } from "@/utils/i18n";

export const metadata: Metadata = {
  title: "Snail Herald",
  description: "A time-delayed letter application",
  icons: [
    { rel: "icon", url: "/favicon.ico" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
