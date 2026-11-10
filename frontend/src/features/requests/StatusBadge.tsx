import { STATUS_LABELS, type Status } from "./types";

const STYLES: Record<Status, string> = {
  OPEN: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  IN_PROGRESS:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  CLOSED: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
