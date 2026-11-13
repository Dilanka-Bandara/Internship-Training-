// Recognises "the database cannot be reached" errors, so the API can answer
// 503 (temporary, try again) instead of a generic 500.

// Network error codes from Node.js / the pg driver, PostgreSQL "server is
// shutting down / starting up" codes, and Prisma "can't reach database" codes.
const UNAVAILABLE_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "57P01",
  "57P02",
  "57P03",
  "P1001",
  "P1002",
  "P1017",
]);

const UNAVAILABLE_MESSAGES = [
  /connection terminated/i,
  /connect ECONNREFUSED/i,
  /can't reach database server/i,
  /server closed the connection/i,
];

export function isDatabaseUnavailable(err: unknown): boolean {
  // Look at the error and its causes (drivers often wrap the real error).
  let current: unknown = err;
  for (let depth = 0; depth < 5 && current; depth++) {
    if (typeof current !== "object") return false;
    const e = current as { code?: unknown; message?: unknown; cause?: unknown };
    if (typeof e.code === "string" && UNAVAILABLE_CODES.has(e.code)) {
      return true;
    }
    if (
      typeof e.message === "string" &&
      UNAVAILABLE_MESSAGES.some((re) => re.test(e.message as string))
    ) {
      return true;
    }
    current = e.cause;
  }
  return false;
}
