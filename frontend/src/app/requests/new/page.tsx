import type { Metadata } from "next";
import { RequestForm } from "@/features/requests/RequestForm";

export const metadata: Metadata = { title: "New request · Service Requests" };

export default function NewRequestPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New service request</h1>
      <RequestForm />
    </div>
  );
}
