import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import prisma from "../../helper/databaseConnection";
import { emitNotification } from "../..";

export async function VerifyUser(req: Request, res: Response) {
  const { key, userId } = req.body;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const isValidUser = await prisma.verify.findFirst({
        where: {
          userId,
        },
      });
      if (isValidUser) {
        const limitTime = new Date(isValidUser.limitTime);
        const todayDate = new Date();
        if (limitTime > todayDate) {
          const isValid = await prisma.verify.findFirst({
            where: {
              userId,
              key,
            },
          });
          if (isValid) {
            return await prisma.user.update({
              data: {
                isVerified: true,
                notifications: {
                  create: {
                    title: "User Verified",
                    description:
                      "You are successfully verified through our system process",
                  },
                },
              },
              where: {
                id: userId,
              },
              include: {
                notifications: true,
              },
            });
          } else {
            throw new Error("Incorrect key against user id");
          }
        } else {
          throw new Error(
            "Your Key has been expired, Please Request for new Key"
          );
        }
      } else {
        throw new Error("No user found against user id");
      }
    });
    emitNotification(userId, {
      status: 200,
      message: "successful data notification via socket",
      result: result.notifications,
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("Successfully verified an user", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
