import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Herald",
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
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
