import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function DeleteExpenseType(req: Request, res: Response) {
  const { id }:{id:string} = req.body;
  try {
    const result = await prisma.expenseType.delete({
        where:{
            id:id
        }
    })
    res.status(200).json(GenerateSuccessJSON('Successfully deleted expense type',result))
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
