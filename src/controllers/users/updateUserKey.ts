import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateFourDigitKey } from "../../helper/generateFourDigitKey";
import { getMaxDateTime } from "../../helper/getMaxDateTime";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { SendEmailVerifyKey } from "../../helper/sendEmailVerifyKey";

export async function UpdateUserKey(req: Request, res: Response) {
  const { userId } = req.body;
  const generatedKey = String(GenerateFourDigitKey());
  const maxDateLimit = getMaxDateTime();
  let fname: string | undefined = "";
  let lname: string | undefined = "";
  let email: string | undefined = "";
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const isValidUser = await prisma.verify.findFirst({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });

      fname = isValidUser?.user.fname;
      lname = isValidUser?.user.lname;
      email = isValidUser?.user.email;

      if (isValidUser) {
        let res = await prisma.verify.update({
          data: {
            key: generatedKey,
            limitTime: maxDateLimit,
          },
          where: {
            userId,
          },
        });
        await prisma.notification.create({
          data: {
            title: "Key Updated",
            description: `Your verification key has been updated, Please see your email.`,
            userId,
          },
        });
      } else {
        throw new Error("No user found against user id");
      }
    });

    try {
      const response = SendEmailVerifyKey(
        email,
        generatedKey,
        maxDateLimit,
        fname,
        lname
      );
      return res
        .status(200)
        .json(
          GenerateSuccessJSON(
            "Updated user key successfully with email service ",
            result
          )
        );
    } catch (e) {
      return res
        .status(200)
        .json(
          GenerateSuccessJSON(
            "Updated user key successfully without email service " + e,
            result
          )
        );
    }
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
