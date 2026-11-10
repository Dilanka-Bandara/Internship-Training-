import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

// Fail fast with a clear message if a setting is missing or wrong.
// Only variable names are printed — never their values.
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    z.flattenError(parsed.error).fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
