import type { Metadata } from "next";
import Link from "next/link";
import { RequestList } from "@/features/requests/RequestList";

export const metadata: Metadata = { title: "Requests · Service Requests" };

export default function RequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Service requests</h1>
        <Link
          href="/requests/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          New request
        </Link>
      </div>
      <RequestList />
    </div>
  );
}
