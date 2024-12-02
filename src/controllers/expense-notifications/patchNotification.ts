import { Request, Response } from "express";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";

export async function PatchNotificationRead(req: Request, res: Response) {
  const { id, userId } = req.body;
  const isRead = true;
  if (id) {
    const result = await prisma.$transaction(async (prisma) => {
      const existingRecord = await prisma.notification.findFirst({
        where: {
          id,
          userId
        },
      });
      if (existingRecord) {
        try {
          return await prisma.notification.update({
            data: {
              isRead,
            },
            where: {
              id,
            },
          });
        } catch (e) {
          AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
        }
      }
    });
    res
      .status(200)
      .json(GenerateSuccessJSON("successfully update budget amount", result));
  } else {
    AddLogs(
      req.url,
      400,
      JSON.stringify(req.body),
      new Error("Id not found"),
      res
    );
  }
}
