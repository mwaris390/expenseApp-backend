import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function deleteExpense(req: Request, res: Response) {
  const { id, userId, categoryId, amount } = req.body;
  console.log(req.body);
  
  if (id) {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        const existingExpense = await prisma.expense.findFirst({
          where: {
            id: id,
          },
        });
        if (existingExpense) {
          const isBudgetExist = await prisma.budget.findFirst({
            where: {
              expenseCategoryId: categoryId,
              userId: userId,
            },
            select: {
              id: true,
            },
          });
          console.log(isBudgetExist);
          
          if (isBudgetExist) {
            try {
              const result = await prisma.expense.delete({
                where: {
                  id,
                },
              });
              await prisma.budget.update({
                data: {
                  amount: {
                    decrement: amount,
                  },
                },
                where: {
                  userId,
                  id: isBudgetExist.id,
                },
              });
              return result;
            } catch (e) {
              AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
            }
          } else {
            try {
              return await prisma.expense.delete({
                where: {
                  id,
                },
              });
            } catch (e) {
              AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
            }
          }
        } else {
          throw new Error("no record found to delete");
        }
      });
      res.status(200).json(GenerateSuccessJSON("delete expense", result));
    } catch (e) {
      AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
    }
  } else {
    AddLogs(
      req.url,
      400,
      JSON.stringify(req.body),
      new Error("no id found"),
      res
    );
  }
}
