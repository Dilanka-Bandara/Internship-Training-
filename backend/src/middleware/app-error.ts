// An expected error with a safe message for the client.
// Thrown anywhere; turned into JSON by the error handler.
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}
