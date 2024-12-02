import express from "express";
import { AddExpense } from "../../controllers/expense/addExpense";
import { AddExpenseSchema } from "../../middlewares/expense/expense";
import { readExpense } from "../../controllers/expense/readExpense";
import { UpdateExpense } from "../../controllers/expense/updateExpense";
import { deleteExpense } from "../../controllers/expense/deleteExpense";
import { CountExpense } from "../../controllers/expense/countExpense";

const router = express.Router();

router.get("/expense-count/:id", CountExpense);
router.post("/expense", AddExpenseSchema, AddExpense);
router.get("/expense/:id", readExpense);
router.delete("/expense", deleteExpense);
router.put("/expense", AddExpenseSchema, UpdateExpense);

export default router;
