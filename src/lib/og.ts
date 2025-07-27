import type { Metadata } from "next";

const APP_NAME = "nazuna manga";
const APP_DEFAULT_TITLE = "nazuna";
const APP_TITLE_TEMPLATE = "%s - nazuna";
const APP_DESCRIPTION =
  "nazuna manga - Đọc truyện tranh free online, đọc manga, manhua, manhwa, truyện tranh tiếng việt, tiếng anh, tiếng nhật, tiếng trung, tiếng hàn hỗ trợ nhiều source";

export const OpenGraph: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icons/logo_nazuna.svg",
        href: "/icons/logo_nazuna.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icons/logo_nazuna.svg",
        href: "/icons/logo_nazuna.svg",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Nazuna",
    "Nazuna PWA",
    "Nazuna manga",
    "Nazuna manhua",
    "Nazuna manhwa",
    "Nazuna truyện tranh",
    "Nazuna truyện tranh online",
    "Nazuna truyện tranh free",
    "Nazuna truyện tranh tiếng việt",
    "Nazuna truyện tranh tiếng anh",
    "Nazuna truyện tranh tiếng nhật",
    "Nazuna truyện tranh tiếng trung",
    "Nazuna truyện tranh tiếng hàn",
    "Nazuna truyện tranh tiếng việt",
    "Nazuna truyện tranh tiếng anh",
    "Nazuna truyện tranh tiếng nhật",
    "Nazuna truyện tranh tiếng trung",
    "Nazuna truyện tranh tiếng hàn",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};
