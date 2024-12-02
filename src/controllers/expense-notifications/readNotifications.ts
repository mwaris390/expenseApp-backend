import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { emitNotification } from "../..";

export async function ReadNotifications(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    try {
      const result = await prisma.notification.findMany({
        where: {
          userId: id,
        },
      });

      emitNotification(id, result);

      res
        .status(200)
        .json(GenerateSuccessJSON("successfully read notifications via socket", result));
    } catch (e) {
      AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
    }
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
