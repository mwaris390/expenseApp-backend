import express from "express";
import { AddUser } from "../../controllers/users/addUsers";
import { AddUsersSchema } from "../../middlewares/users/addUsersSchema";
import { ReadUsers } from "../../controllers/users/readUsers";
import { DeleteUser } from "../../controllers/users/deleteUser";
import { UpdateUser } from "../../controllers/users/updateUser";
import { UpdateUserProfilePic } from "../../controllers/users/UpdateUserProfilePic";
import { ReadUserFilename } from "../../controllers/users/readUserFileName";
import { VerifyUserSchema } from "../../middlewares/users/verifyUserSchema";
import { VerifyUser } from "../../controllers/users/verifyUser";
import { NonVerifyUser } from "../../controllers/users/nonVerifyUser";
import { UpdateUserKey } from "../../controllers/users/updateUserKey";
const router = express.Router();

router.post("/register-users", AddUsersSchema, AddUser);
router.get("/users/:id", ReadUsers);
router.get("/user-image/:filename", ReadUserFilename);
router.put("/users", AddUsersSchema, UpdateUser);
router.delete("/users", DeleteUser);
router.patch("/users", UpdateUserProfilePic);
router.post("/verify-user", VerifyUserSchema, VerifyUser);
router.put("/verify-user-update", VerifyUserSchema, UpdateUserKey);
router.get("/non-verify-users", NonVerifyUser);

export default router;
