import { NextFunction, Request, Response } from "express";
import z from "zod";
import { AddLogs } from "../../controllers/apiLogs/addLogs";
export function AddExpenseCategorySchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const expenseCategorySchema = z
    .object({
      userId: z.string(),
      title: z.string(),
      description: z.string(),
      isCommon: z.boolean(),
    })
    .partial({
      isCommon: true,
      userId: true,
    });
  const response = expenseCategorySchema.safeParse(req.body);
  if (response.success) {
    next();
  } else {
    AddLogs(req.url, 400, JSON.stringify(req.body), response.error.format(), res);
  }
}
