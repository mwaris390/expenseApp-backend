import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function readExpense(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await prisma.expense.findMany({
      where: {
        userId: id,
      },
      include:{
        category:{
          select:{
            title:true
          }
        },
        type:{
          select:{
            title:true
          }
        }
      }
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("successfully read expense", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
