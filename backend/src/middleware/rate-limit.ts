import { rateLimit } from "express-rate-limit";
import { env } from "../config/environment.js";

// Limits how often one client (by IP) can call the API, so a single
// misbehaving client cannot flood it. Uses the standard error shape.
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: env.RATE_LIMIT_PER_MINUTE,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  // Automated tests send many requests quickly from one address.
  skip: () => env.NODE_ENV === "test",
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please wait a minute and try again.",
      },
    });
  },
});
