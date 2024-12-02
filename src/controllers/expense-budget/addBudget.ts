import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { emitNotification } from "../..";

export async function AddBudget(req: Request, res: Response) {
  const { startDate, endDate, limitAmount, userId, categoryId } = req.body;
  try {
    const result = await prisma.budget.create({
      data: {
        startDate: startDate,
        endDate: endDate,
        limitAmount: limitAmount,
        amount: 0,
        userId: userId,
        expenseCategoryId: categoryId,
      },
    });
    const updateExistingRecordAmount = await prisma.$transaction(
      async (prisma) => {
        const expenseByCategory = await prisma.expense.findMany({
          where: {
            userId,
            category: {
              id: result.expenseCategoryId,
            },
          },
          select: {
            amount: true,
          },
        });

        console.log("Expense by category", expenseByCategory);
        let initialAmount = 0;
        // let updateAmount: any;
        for (const expense of expenseByCategory) {
          initialAmount += expense.amount;
          const updateAmount = await prisma.budget.update({
            data: {
              amount: initialAmount,
            },
            where: {
              id: result.id,
              userId,
            },
            include:{
              category:true
            }
          });
          let actualAmount = updateAmount.amount || 0;
          let limitAmount = updateAmount.limitAmount;
          let budgetName = updateAmount.category.title;
          if (actualAmount >= limitAmount) {
            let res = await prisma.notification.create({
              data: {
                title: `Exceed Limit of ${budgetName} Budget`,
                description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                userId: userId,
              },
            });
            emitNotification(userId, {
              status: 200,
              message: "successful data notification via socket",
              result: res,
            });
            console.log(result);
          }
        }
        
      }
    );
    res
      .status(200)
      .json(GenerateSuccessJSON("successfully added budget", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
