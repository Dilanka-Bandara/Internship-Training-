// Runs once before all tests (Vitest "globalSetup"):
// brings the test database schema up to date with the committed migrations.
import { execSync } from "node:child_process";
import { loadTestEnv } from "./test-env.js";

export default function setup(): void {
  loadTestEnv();
  execSync("npx prisma migrate deploy", {
    stdio: "pipe",
    env: process.env,
  });
}
