import { makeError } from "@/utils/errors";
import { type Context } from "hono";

export async function errorHandlerMiddleware(err: Error, c: Context) {
  const result = makeError(err);
  if (!result) {
    throw new Error("Error handler failed to process error");
  }
  const { error, statusCode } = result;
  console.error(error.message, error);
  return c.json(error, { status: statusCode } as any);
}
