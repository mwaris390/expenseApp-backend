import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import bcrypt from "bcrypt";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { emitNotification } from "../..";

export async function ResetPassword(req: Request, res: Response) {
  const { id, currentPassword, newPassword, currentHashPassword } = req.body;
  try {
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentHashPassword
    );
    
    if (isCurrentPasswordValid) {
      const newHashPassword = await bcrypt.hash(newPassword, 5);
      const response = await prisma.user.update({
        data: {
          password: newHashPassword,
        },
        where: {
          id,
        },
      });

      const response2 = await prisma.notification.create({
        data: {
          title: 'Update password',
          description:"Successfully Updated password",
          userId:id
        }
      });
      emitNotification(id, {
        status: 200,
        message: "successful data notification via socket",
        result: response2,
      });
      res.status(200).json(GenerateSuccessJSON("successfully Change Password", response));
    }else{
    AddLogs(req.url, 400, JSON.stringify(req.body), 'Current Password is Incorrect', res);
    }
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
