import { Response, response } from "express";
import prisma from "../../helper/databaseConnection";

export async function AddLogs(
  url: string,
  statusCode: number,
  payLoad: string,
  error: unknown | Error,
  res: Response
) {
  try {
    const jsonResponse = generateErrorJSON(error);
    const result = await prisma.logs.create({
      data: {
        url: url,
        statusCode: statusCode,
        payload: payLoad,
        response: JSON.stringify(jsonResponse),
      },
    });
    return res.status(statusCode).json(jsonResponse);
  } catch (e) {
    console.log("Error occurred inserting log", e);
    return res.status(400).json(generateErrorJSON(e));
  }
}
function generateErrorJSON(error: Error | unknown) {
  return {
    status: false,
    message: "Error occurred",
    error: error instanceof Error ? error.message : error,
  };
}
