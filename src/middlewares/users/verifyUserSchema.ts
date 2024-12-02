import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AddLogs } from "../../controllers/apiLogs/addLogs";

export async function VerifyUserSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { key, userId } = req.body;
  const schema = z
    .object({
      key: z.string().length(4),
      userId: z.string().uuid(),
    })
    .partial({ key: true });
  const response = schema.safeParse({ key, userId });
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
