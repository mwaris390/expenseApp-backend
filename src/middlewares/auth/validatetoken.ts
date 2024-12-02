import { NextFunction, Request, Response } from "express";
import { AddLogs } from "../../controllers/apiLogs/addLogs";
import { VerifyJWT } from "../../helper/validateJWToken";
import { GenerateJWT } from "../../helper/generateJWToken";

export async function ValidateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.url.includes("/login") || req.url.includes("/register-users")) {
    console.log("non protected url");

    next();
  } else {
    console.log(" protected url");

    const token = req.cookies.token;

    if (token) {
      const decoded = VerifyJWT(token);
      if (decoded?.success) {
        const token = await GenerateJWT();
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite:'lax'
        });
        next();
      } else {
        AddLogs(req.url, 401, JSON.stringify(req.body), decoded?.response, res);
      }
    } else {
      AddLogs(
        req.url,
        400,
        JSON.stringify(req.body),
        new Error("Token not provided"),
        res
      );
    }
  }
}
