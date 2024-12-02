import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { AddLogs } from "../apiLogs/addLogs";

export async function UpdateExpenseCategoryByUser(req: Request, res: Response) {
  const { id, title, description } = req.body;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const existingCategory = await prisma.expenseCategory.findFirst({
        where: {
          id: id,
          isCommon: false,
        },
      });
      if (existingCategory) {
        await prisma.expenseCategory.update({
          data: {
            title: title,
            description: description,
          },
          where: {
            id: id,
          },
        });
      } else {
        throw new Error('No record Found in category')
      }
    });
    res
      .status(200)
      .json(
        GenerateSuccessJSON("Successfully update category by user", result)
      );
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
