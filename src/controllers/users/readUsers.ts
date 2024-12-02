import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function ReadUsers(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return res
      .status(200)
      .json(GenerateSuccessJSON("Find user successfully", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
