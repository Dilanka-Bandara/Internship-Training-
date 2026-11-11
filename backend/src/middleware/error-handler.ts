import type { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error.js";

// Every error response uses this shape (docs/api-contract.md).
function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  res.status(status).json({
    error: details === undefined ? { code, message } : { code, message, details },
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  sendError(res, 404, "ROUTE_NOT_FOUND", "Route not found");
}

function bodyParserErrorType(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "type" in err) {
    return String((err as { type: unknown }).type);
  }
  return undefined;
}

// Four parameters = Express treats this as the error handler. Register it LAST.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  const type = bodyParserErrorType(err);
  if (type === "entity.parse.failed") {
    return sendError(res, 400, "INVALID_JSON", "Body is not valid JSON");
  }
  if (type === "entity.too.large") {
    return sendError(res, 413, "PAYLOAD_TOO_LARGE", "Request body is too large");
  }

  // Unexpected: full details go to the server log only, never to the client.
  console.error(err);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong");
}
