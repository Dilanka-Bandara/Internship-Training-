import { z } from "zod";

// Server-side validation. The frontend checks too, but only for comfort —
// anyone can call the API directly, so these checks are the real ones.

export const categoryEnum = z.enum(["IT", "FACILITIES", "OTHER"]);
export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);

// Unknown fields (e.g. "status", "id", "createdAt") are dropped:
// the client cannot choose them.
export const createRequestSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, { error: "Title is required", abort: true })
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be at most 120 characters"),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, { error: "Description is required", abort: true })
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  category: categoryEnum,
  priority: priorityEnum,
});

export const updateStatusSchema = z.object({ status: statusEnum });
export const idParamSchema = z.object({ id: z.uuid("Invalid request id") });
export const listQuerySchema = z.object({ status: statusEnum.optional() });

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type RequestStatus = z.infer<typeof statusEnum>;
