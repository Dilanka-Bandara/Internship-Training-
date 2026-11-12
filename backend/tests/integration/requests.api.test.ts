// Integration tests: real Express app + real PostgreSQL TEST database.
// Supertest sends HTTP requests to the app without opening a port.
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { prisma } from "../../src/database/connection.js";

const validBody = {
  title: "Printer not working",
  description: "The 2nd floor printer shows error E04.",
  category: "IT",
  priority: "HIGH",
};
const UNKNOWN_ID = "3f1c2a7e-0000-4000-8000-000000000000";

async function createRequest(overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post("/api/requests")
    .send({ ...validBody, ...overrides });
  expect(res.status).toBe(201);
  return res.body as { id: string; status: string };
}

// Start every test from an empty table so results never depend on order.
beforeEach(async () => {
  await prisma.serviceRequest.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/health", () => {
  it("returns 200 when the database is reachable", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", database: "up" });
  });
});

describe("POST /api/requests", () => {
  it("creates a request with status OPEN and server-set fields", async () => {
    const res = await request(app).post("/api/requests").send(validBody);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ ...validBody, status: "OPEN" });
    expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(res.body.createdAt).toBeDefined();
  });

  it("ignores a status sent by the client (always OPEN)", async () => {
    const res = await request(app)
      .post("/api/requests")
      .send({ ...validBody, status: "CLOSED" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("OPEN");
  });

  it("returns 400 with field errors for missing fields", async () => {
    const res = await request(app).post("/api/requests").send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(Object.keys(res.body.error.details).sort()).toEqual([
      "category",
      "description",
      "priority",
      "title",
    ]);
  });

  // Regression test for evidence/Day-08/bug-log.md
  it("returns a single 'Title is required' message for a blank title", async () => {
    const res = await request(app)
      .post("/api/requests")
      .send({ ...validBody, title: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error.details.title).toEqual(["Title is required"]);
  });

  it("returns 400 for an unknown priority", async () => {
    const res = await request(app)
      .post("/api/requests")
      .send({ ...validBody, priority: "URGENT" });
    expect(res.status).toBe(400);
    expect(res.body.error.details.priority).toBeDefined();
  });

  it("returns 400 INVALID_JSON for a broken JSON body", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Content-Type", "application/json")
      .send('{"title": ');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_JSON");
  });

  it("does not save anything when validation fails", async () => {
    await request(app).post("/api/requests").send({ title: "" });
    expect(await prisma.serviceRequest.count()).toBe(0);
  });
});

describe("GET /api/requests", () => {
  it("returns an empty array when there are no requests", async () => {
    const res = await request(app).get("/api/requests");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("lists requests newest first and filters by status", async () => {
    const first = await createRequest({ title: "First request" });
    const second = await createRequest({ title: "Second request" });
    await request(app)
      .patch(`/api/requests/${first.id}/status`)
      .send({ status: "IN_PROGRESS" });

    const all = await request(app).get("/api/requests");
    expect(all.body.map((r: { id: string }) => r.id)).toEqual([
      second.id,
      first.id,
    ]);

    const open = await request(app).get("/api/requests?status=OPEN");
    expect(open.body.map((r: { id: string }) => r.id)).toEqual([second.id]);
  });

  it("returns 400 for an invalid status filter", async () => {
    const res = await request(app).get("/api/requests?status=DONE");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/requests/:id", () => {
  it("returns the request", async () => {
    const created = await createRequest();
    const res = await request(app).get(`/api/requests/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.id);
  });

  it("returns 400 for an id that is not a UUID", async () => {
    const res = await request(app).get("/api/requests/abc");
    expect(res.status).toBe(400);
    expect(res.body.error.details.id).toEqual(["Invalid request id"]);
  });

  it("returns 404 for an id that does not exist", async () => {
    const res = await request(app).get(`/api/requests/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("REQUEST_NOT_FOUND");
  });
});

describe("PATCH /api/requests/:id/status", () => {
  it("allows OPEN -> IN_PROGRESS and saves it", async () => {
    const created = await createRequest();
    const res = await request(app)
      .patch(`/api/requests/${created.id}/status`)
      .send({ status: "IN_PROGRESS" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("IN_PROGRESS");

    const saved = await prisma.serviceRequest.findUnique({
      where: { id: created.id },
    });
    expect(saved?.status).toBe("IN_PROGRESS");
  });

  it("returns 409 and keeps the old status for OPEN -> RESOLVED", async () => {
    const created = await createRequest();
    const res = await request(app)
      .patch(`/api/requests/${created.id}/status`)
      .send({ status: "RESOLVED" });
    expect(res.status).toBe(409);
    expect(res.body.error).toEqual({
      code: "INVALID_STATUS_TRANSITION",
      message: "Cannot change status from OPEN to RESOLVED",
    });

    const saved = await prisma.serviceRequest.findUnique({
      where: { id: created.id },
    });
    expect(saved?.status).toBe("OPEN");
  });

  it("returns 409 for any change from CLOSED", async () => {
    const created = await createRequest();
    await request(app)
      .patch(`/api/requests/${created.id}/status`)
      .send({ status: "CLOSED" });
    const res = await request(app)
      .patch(`/api/requests/${created.id}/status`)
      .send({ status: "OPEN" });
    expect(res.status).toBe(409);
  });

  it("returns 400 for an invalid status value", async () => {
    const created = await createRequest();
    const res = await request(app)
      .patch(`/api/requests/${created.id}/status`)
      .send({ status: "open" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown id", async () => {
    const res = await request(app)
      .patch(`/api/requests/${UNKNOWN_ID}/status`)
      .send({ status: "IN_PROGRESS" });
    expect(res.status).toBe(404);
  });
});

describe("errors", () => {
  it("returns 404 ROUTE_NOT_FOUND for an unknown route", async () => {
    const res = await request(app).get("/api/nothing");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("never includes a stack trace in error responses", async () => {
    const res = await request(app).get("/api/requests/abc");
    expect(JSON.stringify(res.body)).not.toMatch(/at .*\.ts|stack/i);
  });
});
