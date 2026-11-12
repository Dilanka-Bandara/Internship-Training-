import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The home page has no content of its own: send visitors to the list.
  redirects() {
    return [{ source: "/", destination: "/requests", permanent: false }];
  },
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
