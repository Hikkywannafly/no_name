import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/lib/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage-ct.lrclib.net",
        port: "",
        pathname: "/file/cuutruyen/**",
      },
      {
        protocol: "https",
        hostname: "cuutruyen.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nettruyen.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "truyenqq.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "truyenfull.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        port: "",
        pathname: "/file/anilistcdn/**",
      },
    ],
  },
});
