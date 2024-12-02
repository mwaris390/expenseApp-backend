import express from "express";
import { AddExpenseCategorySchema } from "../../middlewares/expense-categories/addExpenseCategorySchema";
import { AddExpenseCategoryForAll } from "../../controllers/expense-categories/addExpenseCategoryForAll";
import { AddExpenseCategoryByUser } from "../../controllers/expense-categories/addExpenseCategoryByUser";
import { deleteExpenseCategory } from "../../controllers/expense-categories/deleteExpenseCategory";
import { ReadExpenseCategory } from "../../controllers/expense-categories/readExpenseCategory";
import { UpdateExpenseCategoryByUser } from "../../controllers/expense-categories/updateExpenseCategory";

const router = express.Router();

router.post(
  "/expense-category-by-user",
  AddExpenseCategorySchema,
  AddExpenseCategoryByUser
);
router.post(
  "/expense-category-for-all",
  AddExpenseCategorySchema,
  AddExpenseCategoryForAll
);
router.get("/expense-category/:id", ReadExpenseCategory);
router.put(
  "/expense-category",
  AddExpenseCategorySchema,
  UpdateExpenseCategoryByUser
);
router.delete("/expense-category", deleteExpenseCategory);

export default router;
