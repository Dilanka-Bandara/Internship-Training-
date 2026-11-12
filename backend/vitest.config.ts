import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup/load-env.ts"],
    globalSetup: ["tests/setup/global-setup.ts"],
    // Integration tests share one test database: run files one at a time
    // so they cannot delete each other's data.
    fileParallelism: false,
  },
});
