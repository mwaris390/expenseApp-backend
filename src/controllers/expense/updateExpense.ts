import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import prisma from "../../helper/databaseConnection";

export async function UpdateExpense(req: Request, res: Response) {
  const { id, title, description, amount, userId, typeId, categoryId } =
    req.body;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const existingData = await prisma.expense.findFirst({
        where: {
          id: id,
        },
      });
      if (existingData) {
        const isBudgetExist = await prisma.budget.findFirst({
          where: {
            expenseCategoryId: categoryId,
            userId: userId,
          },
          select: {
            id: true,
            amount: true,
          },
        });

        let isTypeNotChange = existingData.expenseTypeId == typeId;
        let isCategoryNotChange = existingData.expenseCategoryId == categoryId;

        if (isBudgetExist) {
          if (isTypeNotChange && isCategoryNotChange) {
            const result = await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
            let existingAmount = existingData.amount;
            let newAmount = Math.abs(existingAmount - amount);
            let resultFromBudget;
            if (amount >= existingAmount) {
              resultFromBudget = await prisma.budget.update({
                data: {
                  amount: {
                    increment: newAmount,
                  },
                },
                where: {
                  userId,
                  id: isBudgetExist.id,
                },
                include: {
                  category: true,
                },
              });
            }
            if (amount <= existingAmount) {
              resultFromBudget = await prisma.budget.update({
                data: {
                  amount: {
                    decrement: newAmount,
                  },
                },
                where: {
                  userId,
                  id: isBudgetExist.id,
                },
                include: {
                  category: true,
                },
              });
            }

            let actualAmount = resultFromBudget?.amount || 0;
            let limitAmount = resultFromBudget?.limitAmount || 0;
            let budgetName = resultFromBudget?.category.title;
            if (actualAmount > limitAmount) {
              await prisma.notification.create({
                data: {
                  title: `Exceed Limit of ${budgetName} Budget`,
                  description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                  userId: userId,
                },
              });
            }
            return result;
          }
          if (
            !isTypeNotChange &&
            typeId != "8fe07646-de90-412a-8419-a9b6001cae07" &&
            isCategoryNotChange
          ) {
            const result = await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
            let resultFromBudget;
            resultFromBudget = await prisma.budget.update({
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
            });
            let actualAmount = resultFromBudget?.amount || 0;
            let limitAmount = resultFromBudget?.limitAmount || 0;
            let budgetName = resultFromBudget?.category.title;
            if (actualAmount > limitAmount) {
              await prisma.notification.create({
                data: {
                  title: `Exceed Limit of ${budgetName} Budget`,
                  description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                  userId: userId,
                },
              });
            }
            return result;
          }
          if (
            !isTypeNotChange &&
            typeId == "8fe07646-de90-412a-8419-a9b6001cae07" &&
            isCategoryNotChange
          ) {
            const result = await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
            let resultFromBudget;
            resultFromBudget = await prisma.budget.update({
              data: {
                amount: {
                  decrement: amount,
                },
              },
              where: {
                userId,
                id: isBudgetExist.id,
              },
              include: {
                category: true,
              },
            });
            let actualAmount = resultFromBudget?.amount || 0;
            let limitAmount = resultFromBudget?.limitAmount || 0;
            let budgetName = resultFromBudget?.category.title;
            if (actualAmount > limitAmount) {
              await prisma.notification.create({
                data: {
                  title: `Exceed Limit of ${budgetName} Budget`,
                  description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                  userId: userId,
                },
              });
            }
            return result;
          }
          if (isTypeNotChange && !isCategoryNotChange) {
            const result = await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
            const isBudgetPrevExist = await prisma.budget.findFirst({
              where: {
                expenseCategoryId: existingData.expenseCategoryId,
                userId: userId,
              },
              select: {
                id: true,
                amount: true,
              },
            });
            if (isBudgetPrevExist) {
              let resultPrevFromBudget;
              resultPrevFromBudget = await prisma.budget.update({
                data: {
                  amount: {
                    decrement: amount,
                  },
                },
                where: {
                  userId,
                  id: isBudgetPrevExist.id,
                },
                include: {
                  category: true,
                },
              });
            }
            let resultFromBudget;
            resultFromBudget = await prisma.budget.update({
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
            });
            let actualAmount = resultFromBudget?.amount || 0;
            let limitAmount = resultFromBudget?.limitAmount || 0;
            let budgetName = resultFromBudget?.category.title;
            if (actualAmount > limitAmount) {
              await prisma.notification.create({
                data: {
                  title: `Exceed Limit of ${budgetName} Budget`,
                  description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                  userId: userId,
                },
              });
            }
            return result;
          }
          if (
            !isTypeNotChange &&
            typeId != "8fe07646-de90-412a-8419-a9b6001cae07" &&
            !isCategoryNotChange
          ) {
            const result = await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
            const isBudgetPrevExist = await prisma.budget.findFirst({
              where: {
                expenseCategoryId: existingData.expenseCategoryId,
                userId: userId,
              },
              select: {
                id: true,
                amount: true,
              },
            });
            if (isBudgetPrevExist) {
              let resultPrevFromBudget;
              resultPrevFromBudget = await prisma.budget.update({
                data: {
                  amount: {
                    decrement: amount,
                  },
                },
                where: {
                  userId,
                  id: isBudgetPrevExist.id,
                },
                include: {
                  category: true,
                },
              });
            }
            let resultFromBudget;
            resultFromBudget = await prisma.budget.update({
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
            });
            let actualAmount = resultFromBudget?.amount || 0;
            let limitAmount = resultFromBudget?.limitAmount || 0;
            let budgetName = resultFromBudget?.category.title;
            if (actualAmount > limitAmount) {
              await prisma.notification.create({
                data: {
                  title: `Exceed Limit of ${budgetName} Budget`,
                  description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                  userId: userId,
                },
              });
            }
            return result;
          }
          if (
            !isTypeNotChange &&
            typeId == "8fe07646-de90-412a-8419-a9b6001cae07" &&
            !isCategoryNotChange
          ) {
            const result = await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
            const isBudgetPrevExist = await prisma.budget.findFirst({
              where: {
                expenseCategoryId: existingData.expenseCategoryId,
                userId: userId,
              },
              select: {
                id: true,
                amount: true,
              },
            });
            if (isBudgetPrevExist) {
              let resultPrevFromBudget;
              resultPrevFromBudget = await prisma.budget.update({
                data: {
                  amount: {
                    decrement: amount,
                  },
                },
                where: {
                  userId,
                  id: isBudgetPrevExist.id,
                },
                include: {
                  category: true,
                },
              });
            }
            let resultFromBudget;
            resultFromBudget = await prisma.budget.update({
              data: {
                amount: {
                  decrement: amount,
                },
              },
              where: {
                userId,
                id: isBudgetExist.id,
              },
              include: {
                category: true,
              },
            });
            let actualAmount = resultFromBudget?.amount || 0;
            let limitAmount = resultFromBudget?.limitAmount || 0;
            let budgetName = resultFromBudget?.category.title;
            if (actualAmount > limitAmount) {
              await prisma.notification.create({
                data: {
                  title: `Exceed Limit of ${budgetName} Budget`,
                  description: `We wanted to inform you that your budget ${budgetName} limit of ${limitAmount} has been exceeded. Please review your recent transactions and adjust your spending accordingly.`,
                  userId: userId,
                },
              });
            }
            return result;
          }
        } else {
          try {
            return await prisma.expense.update({
              data: {
                title,
                description,
                amount,
                userId,
                expenseTypeId: typeId,
                expenseCategoryId: categoryId,
              },
              where: {
                id: id,
              },
            });
          } catch (e) {
            AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
          }
        }
      } else {
        throw new Error("no record found to update");
      }
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("successfully updated expense", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
