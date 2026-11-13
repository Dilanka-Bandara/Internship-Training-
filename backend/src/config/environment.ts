import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z
    .url("CORS_ORIGIN must be a URL")
    .default("http://localhost:3000"),
  // Requests allowed per client IP per minute (not applied in tests).
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(100),
});

// Fail fast with a clear message if a setting is missing or wrong.
// Only variable names are printed — never their values.
const parsed = schema
  .superRefine((cfg, ctx) => {
    // In production the allowed origin must be set on purpose,
    // never silently fall back to localhost.
    if (cfg.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
      ctx.addIssue({
        code: "custom",
        path: ["CORS_ORIGIN"],
        message: "CORS_ORIGIN is required in production",
      });
    }
  })
  .safeParse(process.env);
if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    z.flattenError(parsed.error).fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
