import { AppError } from "../../middleware/app-error.js";
import { requestRepository as repo } from "./repository.js";
import { canTransition } from "./status-rules.js";
import type { CreateRequestInput, RequestStatus } from "./schema.js";

// Business rules only. No req/res, no SQL.
export const requestService = {
  create(input: CreateRequestInput) {
    // Rule: a new request always starts as OPEN.
    return repo.create({ ...input, status: "OPEN" });
  },

  list(status?: RequestStatus) {
    return repo.findMany(status);
  },

  async getById(id: string) {
    const found = await repo.findById(id);
    if (!found) {
      throw new AppError(404, "REQUEST_NOT_FOUND", "Request not found");
    }
    return found;
  },

  async changeStatus(id: string, newStatus: RequestStatus) {
    const current = await requestService.getById(id); // 404 if missing
    // Rule: only allowed transitions (same status again is not allowed).
    if (!canTransition(current.status, newStatus)) {
      throw new AppError(
        409,
        "INVALID_STATUS_TRANSITION",
        `Cannot change status from ${current.status} to ${newStatus}`,
      );
    }
    return repo.updateStatus(id, newStatus);
  },
};
