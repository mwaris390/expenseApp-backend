import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AddLogs } from "../../controllers/apiLogs/addLogs";

export async function AddBudgetSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { startDate, endDate, limitAmount, userId, categoryId, typeId } =
    req.body;
  const schema = z
    .object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      limitAmount: z.number(),
      userId: z.string().uuid(),
      categoryId: z.string().uuid(),
      typeId: z.string().uuid(),
    })
    .partial({
      startDate: true,
      endDate: true,
      typeId: true,
    });
  const response = schema.safeParse({
    startDate,
    endDate,
    limitAmount,
    userId,
    categoryId,
    typeId,
  });
  if (response.success) {
    next();
  } else {
    AddLogs(
      req.url,
      400,
      JSON.stringify(req.body),
      response.error.format(),
      res
    );
  }
}
