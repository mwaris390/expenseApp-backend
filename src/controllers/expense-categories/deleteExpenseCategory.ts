import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { AddLogs } from "../apiLogs/addLogs";

export async function deleteExpenseCategory(req: Request, res: Response) {
  const { id } = req.body;
  try {
    const result = await prisma.expenseCategory.delete({
      where: {
        id,
      },
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("Successfully Deleted Category", result));
  } catch (e) {
        AddLogs(req.url, 400, JSON.stringify(req.body), e, res);

  }
}
