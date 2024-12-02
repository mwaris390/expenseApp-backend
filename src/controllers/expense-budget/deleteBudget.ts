import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import prisma from "../../helper/databaseConnection";

export async function DeleteBudget(req: Request, res: Response) {
  const { id } = req.body;
  if (id) {
    const result = await prisma.$transaction(async (prisma) => {
      const existingRecord = await prisma.budget.findFirst({
        where: {
          id,
        },
      });
      if (existingRecord) {
        try {
          return await prisma.budget.delete({
            where: {
              id,
            },
          });
        } catch (e) {
          AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
        }
      }
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("successfully delete budget", result));
  } else {
    AddLogs(
      req.url,
      400,
      JSON.stringify(req.body),
      new Error("Id not found"),
      res
    );
  }
}
