import { type ClassValue, clsx } from "clsx";
import { err, ok, type Result } from "neverthrow";
import { twMerge } from "tailwind-merge";
import type z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function zodParseResult<T>(
  schema: z.ZodType<T>,
  data: unknown,
): Result<T, z.ZodError<T>> {
  const result = schema.safeParse(data);
  return result.success ? ok(result.data) : err(result.error);
}

export const raise = (e: unknown): never => {
  throw e;
};
