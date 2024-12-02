import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function ReadExpenseCategory(req:Request,res:Response) {
    const {id} = req.params
    
    try {
      const result = await prisma.expenseCategory.findMany({
        where: {
          OR: [
            {
              isCommon: true,
            },
            {
              userId: id,
            },
          ],
        },
      });
      res
        .status(200)
        .json(
          GenerateSuccessJSON("Successfully Added Category By User", result)
        );
    } catch (e) {
          AddLogs(req.url, 400, JSON.stringify(req.body), e, res);

    }
}