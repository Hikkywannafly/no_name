import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme";
import { AnilistContextProvider } from "@/context/useAnilist";
import { OpenGraph } from "@/lib/og";
import { Analytics } from "@vercel/analytics/react";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  ...OpenGraph,
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AnilistContextProvider>
          <ThemeProvider>
            <NextTopLoader
              zIndex={1000}
              easing="ease-in-out"
              speed={400}
              height={4}
              showSpinner={false}
              template={`
        <div class="bar bg-web-title" role="bar"><div class="peg"></div></div> 
  <div class="spinner text-web-title" role="spinner"><div class="spinner-icon"></div></div>`}
            />
            <main>{children}</main>
            <Analytics />
          </ThemeProvider>
        </AnilistContextProvider>
      </body>
    </html>
  );
}
