"use client";

import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  type CreateRequestInput,
} from "./types";

type FieldErrors = Partial<Record<keyof CreateRequestInput, string>>;

const empty: CreateRequestInput = {
  title: "",
  description: "",
  category: "IT",
  priority: "MEDIUM",
};

// Client-side checks are for fast feedback only.
// The API validates again (docs/api-contract.md).
function validate(v: CreateRequestInput): FieldErrors {
  const errors: FieldErrors = {};
  const title = v.title.trim();
  const description = v.description.trim();
  if (!title) errors.title = "Title is required";
  else if (title.length < 3)
    errors.title = "Title must be at least 3 characters";
  else if (title.length > 120)
    errors.title = "Title must be at most 120 characters";
  if (!description) errors.description = "Description is required";
  else if (description.length < 10)
    errors.description = "Please describe the problem (10+ characters)";
  else if (description.length > 2000)
    errors.description = "Description must be at most 2000 characters";
  return errors;
}

const inputClass =
  "w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-zinc-900 " +
  "border-zinc-300 dark:border-zinc-700 aria-[invalid=true]:border-red-500";

export function RequestForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  function set<K extends keyof CreateRequestInput>(
    key: K,
    value: CreateRequestInput[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.createRequest(values); // success ONLY after the server says OK
      setResult({ ok: true, text: "Request created." });
      setValues(empty);
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        // Show the server's field errors next to the fields.
        setErrors(
          Object.fromEntries(
            Object.entries(err.details).map(([k, v]) => [k, v[0]]),
          ),
        );
      }
      setResult({
        ok: false,
        text:
          err instanceof Error ? err.message : "Could not create the request",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          maxLength={120}
          className={inputClass}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          maxLength={2000}
          className={inputClass}
        />
        {errors.description && (
          <p
            id="description-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={values.category}
            onChange={(e) =>
              set("category", e.target.value as CreateRequestInput["category"])
            }
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            value={values.priority}
            onChange={(e) =>
              set("priority", e.target.value as CreateRequestInput["priority"])
            }
            className={inputClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {submitting ? "Creating…" : "Create request"}
        </button>
        <Link href="/requests" className="text-sm underline">
          Back to list
        </Link>
      </div>

      {result && (
        <p
          role={result.ok ? "status" : "alert"}
          className={
            result.ok
              ? "rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200"
              : "rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200"
          }
        >
          {result.text}
        </p>
      )}
    </form>
  );
}
