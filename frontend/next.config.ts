import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The home page has no content of its own: send visitors to the list.
  redirects() {
    return [{ source: "/", destination: "/requests", permanent: false }];
  },
  // Basic security headers on every page.
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" }, // no clickjacking via iframes
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  poweredByHeader: false, // don't advertise the framework
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
