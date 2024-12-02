import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function AddExpense(req: Request, res: Response) {
  const { title, description, amount, date, userId, typeId, categoryId } =
    req.body;
  try {
    const isBudgetExist = await prisma.budget.findFirst({
      where: {
        expenseCategoryId: categoryId,
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    let result;
    if (isBudgetExist && typeId != "8fe07646-de90-412a-8419-a9b6001cae07") {
      result = await prisma.$transaction([
        prisma.expense.create({
          data: {
            title,
            description,
            amount,
            date,
            userId,
            expenseTypeId: typeId,
            expenseCategoryId: categoryId,
          },
        }),
        prisma.budget.update({
          data: {
            amount: {
              increment: amount,
            },
          },
          where: {
            userId,
            id: isBudgetExist.id,
          },
          include: {
            category: true,
          },
        }),
      ]);
      let actualAmount = result[1].amount || 0;
      let limitAmount = result[1].limitAmount;
      let budgetName = result[1].category.title;
      if (actualAmount >= limitAmount) {
        result = await prisma.notification.create({
          data: {
            title: `Exceed Limit of ${budgetName} Budget`,
            description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
            userId: userId,
          },
        });
        console.log(result);
      }
    } else {
      result = await prisma.expense.create({
        data: {
          title,
          description,
          amount,
          date,
          userId,
          expenseTypeId: typeId,
          expenseCategoryId: categoryId,
        },
      });
    }
    // const result = await prisma.expense.create({
    //   data: {
    //     title,
    //     description,
    //     amount,
    //     userId,
    //     expenseTypeId: typeId,
    //     expenseCategoryId: categoryId,
    //   },
    // });
    res
      .status(200)
      .json(GenerateSuccessJSON("Successfully added expense", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
