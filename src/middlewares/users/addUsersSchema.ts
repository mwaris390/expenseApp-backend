import { NextFunction, Request, Response } from "express";
import z from "zod";
import { AddLogs } from "../../controllers/apiLogs/addLogs";
import { formatZodErrors } from "../../helper/zodErrorFormat";
export function AddUsersSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userSchema = z
    .object({
      fname: z.string({message:"First name is required"}),
      lname: z.string({message:"Last name is required"}),
      age: z.number({message:"Age is required"}),
      gender: z.string({message:"Gender is required"}),
      email: z.string({message:"Email is required"}).email({message:"Email should be valid"}),
      password: z.string({message:"Password is required"}),
    })
    .partial({
      password: true,
    });
  const response = userSchema.safeParse(req.body);
  if (response.success) {
    next();
  } else {
    console.log(response.error);
    
    AddLogs(
      req.url,
      400,
      JSON.stringify(req.body),
      formatZodErrors(response.error),
      res
    );
  }
}
