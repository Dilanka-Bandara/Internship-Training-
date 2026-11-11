import { Router } from "express";
import { prisma } from "../../database/connection.js";

export const healthRouter = Router();

// 200 when the API and database are up; 503 when the database is unreachable.
healthRouter.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "up" });
  } catch (err) {
    console.error("Health check: database unreachable", err);
    res.status(503).json({
      error: { code: "SERVICE_UNAVAILABLE", message: "Database unavailable" },
    });
  }
});
