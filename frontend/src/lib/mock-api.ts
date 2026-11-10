// TEMPORARY in-memory API used only when NEXT_PUBLIC_USE_MOCK_API=true.
// Lets the list and form be demonstrated before the backend exists.
// Remove on Day 4 when the frontend is connected to the real Express API.
import type {
  CreateRequestInput,
  ServiceRequest,
  Status,
} from "@/features/requests/types";

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();

let items: ServiceRequest[] = [
  {
    id: "6d1f0c52-3b8e-4a8f-9c3e-1a2b3c4d5e01",
    title: "Printer not working",
    description: "The 2nd floor printer shows error E04.",
    category: "IT",
    priority: "HIGH",
    status: "OPEN",
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    id: "6d1f0c52-3b8e-4a8f-9c3e-1a2b3c4d5e02",
    title: "Air conditioner too cold",
    description: "Meeting room B air conditioner cannot be adjusted.",
    category: "FACILITIES",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    createdAt: hoursAgo(26),
    updatedAt: hoursAgo(5),
  },
  {
    id: "6d1f0c52-3b8e-4a8f-9c3e-1a2b3c4d5e03",
    title: "Request new keyboard",
    description: "Several keys on my keyboard stopped working.",
    category: "IT",
    priority: "LOW",
    status: "RESOLVED",
    createdAt: hoursAgo(50),
    updatedAt: hoursAgo(30),
  },
];

const delay = () => new Promise((r) => setTimeout(r, 400));

export const mockApi = {
  async listRequests(status?: Status) {
    await delay();
    return items.filter((r) => !status || r.status === status);
  },
  async getRequest(id: string) {
    await delay();
    const found = items.find((r) => r.id === id);
    if (!found) throw new Error("Request not found");
    return found;
  },
  async createRequest(input: CreateRequestInput) {
    await delay();
    const ts = new Date().toISOString();
    const created: ServiceRequest = {
      ...input,
      title: input.title.trim(),
      description: input.description.trim(),
      id: crypto.randomUUID(),
      status: "OPEN",
      createdAt: ts,
      updatedAt: ts,
    };
    items = [created, ...items];
    return created;
  },
  async updateStatus(id: string, status: Status) {
    await delay();
    const found = items.find((r) => r.id === id);
    if (!found) throw new Error("Request not found");
    const updated = { ...found, status, updatedAt: new Date().toISOString() };
    items = items.map((r) => (r.id === id ? updated : r));
    return updated;
  },
};
