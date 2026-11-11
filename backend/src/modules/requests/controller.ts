import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../middleware/app-error.js";
import { requestService } from "./service.js";
import {
  createRequestSchema,
  idParamSchema,
  listQuerySchema,
  updateStatusSchema,
} from "./schema.js";

// HTTP only: read the request, validate it, call the service, send the response.

// Validate or throw a consistent 400 with { field: [messages] } details.
function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Invalid input",
      z.flattenError(result.error).fieldErrors,
    );
  }
  return result.data;
}

export const requestController = {
  async create(req: Request, res: Response) {
    const input = parse(createRequestSchema, req.body ?? {});
    res.status(201).json(await requestService.create(input));
  },

  async list(req: Request, res: Response) {
    const { status } = parse(listQuerySchema, req.query);
    res.json(await requestService.list(status));
  },

  async getById(req: Request, res: Response) {
    const { id } = parse(idParamSchema, req.params);
    res.json(await requestService.getById(id));
  },

  async changeStatus(req: Request, res: Response) {
    const { id } = parse(idParamSchema, req.params);
    const { status } = parse(updateStatusSchema, req.body ?? {});
    res.json(await requestService.changeStatus(id, status));
  },
};
