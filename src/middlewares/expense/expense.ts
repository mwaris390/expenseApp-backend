import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AddLogs } from "../../controllers/apiLogs/addLogs";

export async function AddExpenseSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, amount, date, userId, typeId, categoryId } = req.body;
  const expenseSchema = z.object({
    title: z.string(),
    description: z.string(),
    amount: z.number(),
    date: z.string().date('date must be valid'),
    userId: z.string({ message: "need user id" }).uuid(),
    typeId: z.string().uuid(),
    categoryId: z.string().uuid(),
  });
  const response = expenseSchema.safeParse({
    title,
    description,
    amount,
    date,
    userId,
    typeId,
    categoryId,
  });
  if (response.success) {
    next();
  } else {
    AddLogs(req.url, 400, JSON.stringify(req.body), response.error.format(), res);
  }
}
