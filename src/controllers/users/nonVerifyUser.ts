import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function NonVerifyUser(req: Request, res: Response) {
  try {
    const result = await prisma.verify.findMany({
        include:{
            user:true
        }
    })
    res.status(200).json(GenerateSuccessJSON('successfully read non verify',result))
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
