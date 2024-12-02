import express from "express";
import { AddBudgetSchema } from "../../middlewares/expense-budgets/expense-budget";
import { AddBudget } from "../../controllers/expense-budget/addBudget";
import { ReadBudget } from "../../controllers/expense-budget/readBudget";
import { DeleteBudget } from "../../controllers/expense-budget/deleteBudget";
import { UpdateBudget } from "../../controllers/expense-budget/updateBudget";
import { PatchAmountBudget } from "../../controllers/expense-budget/patchBudgetAmount";

const router = express.Router();

router.post("/expense-budget",AddBudgetSchema,AddBudget);
router.get("/expense-budget/:id",ReadBudget);
router.delete("/expense-budget",DeleteBudget);
router.put("/expense-budget", AddBudgetSchema, UpdateBudget);
router.patch("/expense-budget",PatchAmountBudget);

export default router;
