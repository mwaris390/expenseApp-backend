import express from "express";
import { AuthSchema } from "../../middlewares/auth/authSchema";
import { AuthUser } from "../../controllers/auth/authUser";
import { ResetPassword } from "../../controllers/auth/resetPassword";
const router = express.Router();
router.post("/login", AuthSchema, AuthUser);
router.post("/reset-password", ResetPassword);
export default router;
