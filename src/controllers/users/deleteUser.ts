import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { AddLogs } from "../apiLogs/addLogs";

export async function DeleteUser(req: Request, res: Response) {
  const { id } = req.body;
  try {
    const result = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return res
      .status(200)
      .json(GenerateSuccessJSON("Delete user successfully", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
