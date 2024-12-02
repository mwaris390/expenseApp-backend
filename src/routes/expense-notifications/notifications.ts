import express from "express";
import { ReadNotifications } from "../../controllers/expense-notifications/readNotifications";
import { DeleteNotification } from "../../controllers/expense-notifications/deleteNotification";
import { PatchNotificationRead } from "../../controllers/expense-notifications/patchNotification";
import { addNotification } from "../../controllers/expense-notifications/addNotification";

const router = express.Router();

// router.post("/expense-notification");
// addNotification(
//   "testing",
//   "testing desc",
//   "f95e849b-2683-4916-bf3d-9643ee5a03f0"
// ).then((res)=>{
//     console.log('added notification');
// }).catch((err)=>{
//     console.log("not added notification",err);
// })
router.get("/expense-notification/:id", ReadNotifications);
router.delete("/expense-notification",DeleteNotification);
router.patch("/expense-notification",PatchNotificationRead);

export default router;
