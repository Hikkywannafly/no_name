import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nazuna ",
    short_name: "Nazunime",
    description:
      "Nazunime is a manga reader app that allows you to read manga online.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    orientation: "portrait",
    icons: [
      // {
      //   src: "icons/android-chrome-192x192.png",
      //   sizes: "192x192",
      //   type: "image/png",
      // },
      // {
      //   src: "icons/android-chrome-512x512.png",
      //   sizes: "512x512",
      //   type: "image/png",
      // },
      // {
      //   src: "icons/apple-touch-icon.png",
      //   sizes: "180x180",
      //   type: "image/png",
      // },
      // {
      //   src: "icons/favicon-16x16.png",
      //   sizes: "16x16",
      //   type: "image/png",
      // },
      // {
      //   src: "icons/favicon-32x32.png",
      //   sizes: "32x32",
      //   type: "image/png",
      // },
    ],
  };
}
