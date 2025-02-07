import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

import { ClientProviders } from "./ClientProviders";

export const metadata: Metadata = {
  title: "Snail Herald",
  description: "A time-delayed letter application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
