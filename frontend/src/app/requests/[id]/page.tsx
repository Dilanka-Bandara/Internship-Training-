import { Suspense } from "react";
import type { Metadata } from "next";
import { RequestDetails } from "@/features/requests/RequestDetails";

export const metadata: Metadata = { title: "Request · Service Requests" };

// The id is only known at request time, so it is read inside <Suspense>
// (required with Cache Components). It is resolved here, on the server,
// and passed down as a plain string — the pattern the Next.js docs use.
export default function RequestDetailsPage({
  params,
}: PageProps<"/requests/[id]">) {
  return (
    <Suspense
      fallback={
        <p role="status" className="text-sm text-zinc-500">
          Loading request…
        </p>
      }
    >
      {params.then(({ id }) => (
        <RequestDetails id={id} />
      ))}
    </Suspense>
  );
}
