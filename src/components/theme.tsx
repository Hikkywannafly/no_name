"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type React from "react";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemeProvider
      enableSystem={false}
      attribute="class"
      storageKey="theme"
      defaultTheme="dark"
      value={{ dark: "dark" }}
    >
      {children}
    </NextThemeProvider>
  );
};
