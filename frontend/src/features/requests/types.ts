// Shapes match docs/api-contract.md.

export const CATEGORIES = ["IT", "FACILITIES", "OTHER"] as const;
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
}

export const STATUS_LABELS: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  IT: "IT",
  FACILITIES: "Facilities",
  OTHER: "Other",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
