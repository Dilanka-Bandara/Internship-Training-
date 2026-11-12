"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { StatusBadge } from "./StatusBadge";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type ServiceRequest,
  type Status,
} from "./types";

// Handles all four UI states: loading, error, empty, success.
export function RequestList() {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [status, setStatus] = useState<Status | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true; // ignore results from an older request
    api
      .listRequests(status || undefined)
      .then((data) => {
        if (!active) return;
        setItems(data);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Something went wrong");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [status, reloadKey]);

  function changeFilter(next: Status | "") {
    setLoading(true);
    setStatus(next);
  }

  function retry() {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <label htmlFor="status-filter" className="text-sm font-medium">
          Filter by status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => changeFilter(e.target.value as Status | "")}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p role="status" className="text-sm text-zinc-500">
          Loading requests…
        </p>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={retry}
            className="self-start rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {status
            ? `No ${STATUS_LABELS[status].toLowerCase()} requests.`
            : "No requests yet."}{" "}
          <Link href="/requests/new" className="font-medium underline">
            Create the first one
          </Link>
          .
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="flex flex-col divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Link
                  href={`/requests/${r.id}`}
                  className="block truncate font-medium hover:underline"
                >
                  {r.title}
                </Link>
                <p className="text-xs text-zinc-500">
                  {CATEGORY_LABELS[r.category]} · {PRIORITY_LABELS[r.priority]}{" "}
                  priority · {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
