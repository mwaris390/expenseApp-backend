import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { AddLogs } from "../apiLogs/addLogs";
import { emitNotification } from "../..";

export async function UpdateUser(req: Request, res: Response) {
  const { id, fname, lname, age, email, gender } = req.body;
  try {
    const result = await prisma.user.update({
      data: {
        fname: fname,
        lname: lname,
        age: age,
        email: email,
        gender: gender,
        notifications: {
          create: {
            title: "Update",
            description: `You have change your profile information.`,
          },
        },
      },
      where: {
        id: id,
      },
      include:{
        notifications:true
      }
    });
    emitNotification(id, {
      status: 200,
      message: "successful data notification via socket",
      result: result.notifications,
    });
    return res
      .status(200)
      .json(GenerateSuccessJSON("Updated user successfully", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
