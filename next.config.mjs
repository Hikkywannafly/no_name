import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/lib/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({
  // Your Next.js config
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
      // Thêm các domain khác nếu cần
    ],
  },
});
