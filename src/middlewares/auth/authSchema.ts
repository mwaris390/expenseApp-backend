import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AddLogs } from "../../controllers/apiLogs/addLogs";

export async function AuthSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const response = schema.safeParse({ email, password });
  if (response.success) {
    next();
  } else {
    AddLogs(req.url, 400, JSON.stringify(req.body), response.error.format(), res);

  }
}
