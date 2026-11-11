import { Router } from "express";
import { requestController as c } from "./controller.js";

// Express 5 passes errors thrown in async handlers to the error handler.
export const requestsRouter = Router();

requestsRouter.post("/", c.create);
requestsRouter.get("/", c.list);
requestsRouter.get("/:id", c.getById);
requestsRouter.patch("/:id/status", c.changeStatus);
