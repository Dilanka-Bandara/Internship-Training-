import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/environment.js";
import { healthRouter } from "./modules/health/routes.js";
import { requestsRouter } from "./modules/requests/routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRateLimit } from "./middleware/rate-limit.js";

// Builds the app without listening on a port, so tests can import it (Day 4).
export const app = express();

app.disable("x-powered-by");
app.use(helmet()); // secure HTTP headers (no sniffing, no framing, etc.)
app.use(cors({ origin: env.CORS_ORIGIN })); // only our frontend may call the API
app.use(express.json({ limit: "100kb" })); // parse JSON bodies, refuse huge ones

app.use("/api/health", healthRouter); // not rate limited: monitoring calls it often
app.use("/api/requests", apiRateLimit, requestsRouter);

app.use(notFoundHandler); // unknown routes
app.use(errorHandler); // must be last
