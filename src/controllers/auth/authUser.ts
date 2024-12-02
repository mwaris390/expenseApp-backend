import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import bcrypt from "bcrypt";
import { GenerateJWT } from "../../helper/generateJWToken";

export async function AuthUser(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const result: any = await prisma.$transaction(async (prisma) => {
      const isEmailValid = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          password: true,
        },
      });
      if (isEmailValid?.password) {
        const isPasswordValid = await bcrypt.compare(
          password,
          isEmailValid?.password
        );
        if (isPasswordValid) {
          const token = await GenerateJWT();
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
          });
          return await prisma.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
              email: true,
              pic: true,
              isVerified: true,
            },
          });
        } else {
          throw new Error("Invalid password provided");
        }
      } else {
        throw new Error("Invalid email provided");
      }
    });
    // Object.assign(result, { token: await GenerateJWT({ email }) });
    res.status(200).json(GenerateSuccessJSON("successfully login", result));
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
