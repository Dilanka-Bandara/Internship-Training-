import express from "express";
import cors from "cors";
import { env } from "./config/environment.js";
import { healthRouter } from "./modules/health/routes.js";
import { requestsRouter } from "./modules/requests/routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

// Builds the app without listening on a port, so tests can import it (Day 4).
export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.CORS_ORIGIN })); // only our frontend may call the API
app.use(express.json({ limit: "100kb" })); // parse JSON bodies, refuse huge ones

app.use("/api/health", healthRouter);
app.use("/api/requests", requestsRouter);

app.use(notFoundHandler); // unknown routes
app.use(errorHandler); // must be last
