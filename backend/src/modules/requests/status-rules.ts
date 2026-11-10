import type { RequestStatus } from "./schema.js";

// The status workflow (docs/data-model.md), as plain data.
// Easy to read and easy to unit test.
export const allowedTransitions: Record<RequestStatus, readonly RequestStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  return allowedTransitions[from].includes(to);
}
