import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function ReadBudget(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    try {
      const result = await prisma.budget.findMany({
        where: {
          userId: id,
        },
        include:{
          category:{
            select:{
              title:true
            }
          }
        }
      });
      res
        .status(200)
        .json(GenerateSuccessJSON("successfully read budget", result));
    } catch (e) {
      AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
    }
  } else {
    AddLogs(req.url, 400, JSON.stringify(req.body), new Error('Id not found'), res);
  }
}
