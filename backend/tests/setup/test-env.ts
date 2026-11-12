import { config } from "dotenv";

// Load .env.test BEFORE any app code reads process.env, and make sure we can
// never wipe the real database by mistake.
export function loadTestEnv(): void {
  config({ path: ".env.test", override: true, quiet: true });

  const url = process.env.DATABASE_URL ?? "";
  const dbName = url.split("/").pop()?.split("?")[0] ?? "";
  if (!dbName.endsWith("_test")) {
    throw new Error(
      `Refusing to run tests: database "${dbName || "(none)"}" does not end in _test. ` +
        "Create backend/.env.test from .env.test.example.",
    );
  }
}
