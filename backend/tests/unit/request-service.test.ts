import { describe, it, expect, vi, beforeEach } from "vitest";

// Replace the real repository with a fake one: no database needed.
vi.mock("../../src/modules/requests/repository.js", () => ({
  requestRepository: {
    create: vi.fn(),
    findMany: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

import { requestRepository } from "../../src/modules/requests/repository.js";
import { requestService } from "../../src/modules/requests/service.js";

const repo = vi.mocked(requestRepository);
const ID = "3f1c2a7e-0000-4000-8000-000000000000";

function record(status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  const now = new Date("2026-11-12T00:00:00.000Z");
  return {
    id: ID,
    title: "Printer not working",
    description: "The 2nd floor printer shows error E04.",
    category: "IT" as const,
    priority: "HIGH" as const,
    status,
    createdAt: now,
    updatedAt: now,
  };
}

describe("requestService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("create() always saves the request as OPEN", async () => {
    repo.create.mockResolvedValue(record("OPEN"));
    await requestService.create({
      title: "Printer not working",
      description: "The 2nd floor printer shows error E04.",
      category: "IT",
      priority: "HIGH",
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "OPEN" }),
    );
  });

  it("getById() throws 404 REQUEST_NOT_FOUND when missing", async () => {
    repo.findById.mockResolvedValue(null);
    await expect(requestService.getById(ID)).rejects.toMatchObject({
      statusCode: 404,
      code: "REQUEST_NOT_FOUND",
    });
  });

  it("changeStatus() throws 404 and does not save when missing", async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      requestService.changeStatus(ID, "IN_PROGRESS"),
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it("changeStatus() throws 409 and does NOT save an invalid transition", async () => {
    repo.findById.mockResolvedValue(record("CLOSED"));
    await expect(requestService.changeStatus(ID, "OPEN")).rejects.toMatchObject(
      {
        statusCode: 409,
        code: "INVALID_STATUS_TRANSITION",
        message: "Cannot change status from CLOSED to OPEN",
      },
    );
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it("changeStatus() saves an allowed transition", async () => {
    repo.findById.mockResolvedValue(record("OPEN"));
    repo.updateStatus.mockResolvedValue(record("IN_PROGRESS"));
    const updated = await requestService.changeStatus(ID, "IN_PROGRESS");
    expect(repo.updateStatus).toHaveBeenCalledWith(ID, "IN_PROGRESS");
    expect(updated.status).toBe("IN_PROGRESS");
  });
});
