import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function ReadExpenseType(req: Request, res: Response) {
    const {id} = req.params
  try {
    const result = await prisma.expenseType.findMany({
        where:{
            OR:[
                {
                    isCommon:true
                },
                {
                    userId:id
                }
            ]
        }
    })
    res.status(200).json(GenerateSuccessJSON("Successfully read expense type",result))
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
