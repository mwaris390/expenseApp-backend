import express from "express";
import { AddExpenseTypeForAll } from "../../controllers/expense-types/addExpenseTypeForAll";
import { AddExpenseTypeByUser } from "../../controllers/expense-types/addExpenseTypeByUser";
import { AddExpenseTypeSchema } from "../../middlewares/expense-types/addExpenseTypeSchema";
import { ReadExpenseType } from "../../controllers/expense-types/readExpenseTypes";
import { DeleteExpenseType } from "../../controllers/expense-types/deleteExpenseType";
import { UpdateExpenseType } from "../../controllers/expense-types/updateExpenseType";


const router = express.Router();

router.post("/expense-type-for-all",AddExpenseTypeSchema,AddExpenseTypeForAll);
router.post("/expense-type-by-user",AddExpenseTypeSchema,AddExpenseTypeByUser);
router.get("/expense-type/:id",ReadExpenseType);
router.put("/expense-type", AddExpenseTypeSchema, UpdateExpenseType);
router.delete("/expense-type",DeleteExpenseType);

export default router;
