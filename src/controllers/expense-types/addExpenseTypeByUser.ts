import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function AddExpenseTypeByUser(req: Request, res: Response) {
  const { title, description,userId } = req.body;
  const isCommon = false;
  try {
    const result = await prisma.expenseType.create({
      data: {
        title: title,
        description: description,
        isCommon: isCommon,
        userId:userId
      },
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("Successfully added expense type", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
