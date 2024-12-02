import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function AddExpenseCategoryForAll(req: Request, res: Response) {
  const { title, description } = req.body;
  const isCommon = true;
  try {
    const result = await prisma.expenseCategory.create({
      data: {
        title: title,
        description: description,
        isCommon:isCommon
      }
    });
    res.status(200).json(GenerateSuccessJSON('Successfully Added Category for All',result))
  } catch (e) {
        AddLogs(req.url, 400, JSON.stringify(req.body), e, res);

  }
}
