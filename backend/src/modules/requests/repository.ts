import { prisma } from "../../database/connection.js";
import type { CreateRequestInput, RequestStatus } from "./schema.js";

// ONLY database work here. No HTTP, no business rules.
// Prisma sends values separately from the SQL text (parameterised queries).
export const requestRepository = {
  create: (data: CreateRequestInput & { status: RequestStatus }) =>
    prisma.serviceRequest.create({ data }),

  findMany: (status?: RequestStatus) =>
    prisma.serviceRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    }),

  findById: (id: string) => prisma.serviceRequest.findUnique({ where: { id } }),

  updateStatus: (id: string, status: RequestStatus) =>
    prisma.serviceRequest.update({ where: { id }, data: { status } }),
};
