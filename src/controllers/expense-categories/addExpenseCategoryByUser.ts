import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function AddExpenseCategoryByUser(req: Request, res: Response) {
  const { title, description, userId } = req.body;
  const isCommon = false;
  try {
    const result = await prisma.expenseCategory.create({
      data: {
        title: title,
        description: description,
        userId: userId,
        isCommon: isCommon
      },
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("Successfully Added Category By User", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
