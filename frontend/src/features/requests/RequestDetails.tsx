"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import { StatusBadge } from "./StatusBadge";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type ServiceRequest,
  type Status,
} from "./types";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string; notFound: boolean }
  | { kind: "ready"; item: ServiceRequest };

export function RequestDetails({ id }: { id: string }) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    api
      .getRequest(id)
      .then((item) => {
        if (active) setState({ kind: "ready", item });
      })
      .catch((e: unknown) => {
        if (!active) return;
        // 400 (malformed id) and 404 both mean "no such request" to the user.
        const notFound =
          e instanceof ApiError && (e.status === 404 || e.status === 400);
        setState({
          kind: "error",
          message: notFound
            ? "Request not found."
            : e instanceof Error
              ? e.message
              : "Something went wrong",
          notFound,
        });
      });
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  async function changeStatus(next: Status) {
    setSaving(true);
    setMessage(null);
    try {
      // Update the screen ONLY after the server confirms.
      const updated = await api.updateStatus(id, next);
      setState({ kind: "ready", item: updated });
      setMessage({
        ok: true,
        text: `Status changed to ${STATUS_LABELS[next]}.`,
      });
    } catch (e) {
      // e.g. 409 "Cannot change status from CLOSED to OPEN" from the server
      setMessage({
        ok: false,
        text: e instanceof Error ? e.message : "Could not update the status",
      });
    } finally {
      setSaving(false);
    }
  }

  if (state.kind === "loading") {
    return (
      <p role="status" className="text-sm text-zinc-500">
        Loading request…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
      >
        <p>{state.message}</p>
        <div className="flex gap-4 text-sm">
          {!state.notFound && (
            <button
              type="button"
              onClick={() => {
                setState({ kind: "loading" });
                setReloadKey((k) => k + 1);
              }}
              className="rounded-md bg-red-700 px-3 py-1.5 font-medium text-white hover:bg-red-800"
            >
              Retry
            </button>
          )}
          <Link href="/requests" className="self-center underline">
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  const { item } = state;

  return (
    <article className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold break-words">{item.title}</h1>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-sm text-zinc-500">
          {CATEGORY_LABELS[item.category]} · {PRIORITY_LABELS[item.priority]}{" "}
          priority
        </p>
      </div>

      <p className="whitespace-pre-wrap break-words">{item.description}</p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-zinc-500">Created</dt>
        <dd>{new Date(item.createdAt).toLocaleString()}</dd>
        <dt className="text-zinc-500">Last updated</dt>
        <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
      </dl>

      <section className="flex flex-col gap-3" aria-labelledby="status-heading">
        <h2 id="status-heading" className="font-medium">
          Change status
        </h2>
        {/* All statuses are offered on purpose: the API decides what is
            allowed and the UI shows its answer (e.g. 409). Hiding buttons
            is not security. */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.filter((s) => s !== item.status).map((s) => (
            <button
              key={s}
              type="button"
              disabled={saving}
              onClick={() => changeStatus(s)}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Mark as {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        {message && (
          <p
            role={message.ok ? "status" : "alert"}
            className={
              message.ok
                ? "rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200"
                : "rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200"
            }
          >
            {message.text}
          </p>
        )}
      </section>

      <Link href="/requests" className="text-sm underline">
        Back to list
      </Link>
    </article>
  );
}
