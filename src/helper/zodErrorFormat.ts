import { ZodError } from "zod";

export const formatZodErrors = (zodError:ZodError) => {
  return zodError.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
};
