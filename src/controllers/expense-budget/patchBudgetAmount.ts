import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function PatchAmountBudget(req: Request, res: Response) {
  const { id, userId, amount } = req.body;
  if (id) {
    const result = await prisma.$transaction(async (prisma) => {
      const existingRecord = await prisma.budget.findFirst({
        where: {
          id,
          userId,
        },
      });
      if (existingRecord) {
        try {
          return await prisma.budget.update({
            data: {
              amount,
            },
            where: {
              id,
              userId,
            },
          });
        } catch (e) {
          AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
        }
      }
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("successfully update budget amount", result));
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
