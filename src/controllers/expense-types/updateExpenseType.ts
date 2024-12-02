import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function UpdateExpenseType(req: Request, res: Response) {
  const { id, title, description } = req.body;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const existingType = await prisma.expenseType.findFirst({
        where: {
          id: id,
          isCommon: false,
        },
      });
      if (existingType) {
        await prisma.expenseType.update({
          data: {
            title: title,
            description: description,
          },
          where: {
            id: id,
          },
        });
      } else {
        throw new Error("No existing type found");
      }
    });
    // const result = await prisma.expenseType.update({
    //     data:{
    //         title:title,
    //         description:description
    //     },
    //     where:{
    //         id:id
    //     }
    // })
    res.status(200).json(GenerateSuccessJSON("Successfully updated", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
