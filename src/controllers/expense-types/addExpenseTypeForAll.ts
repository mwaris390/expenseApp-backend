import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function AddExpenseTypeForAll(req: Request, res: Response) {
  const { title, description } = req.body;
  const isCommon = true
  try {
    const result = await prisma.expenseType.create({
        data:{
            title:title,
            description:description,
            isCommon:isCommon
        }
    })
    res.status(200).json(GenerateSuccessJSON('Successfully added expense type',result))
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
