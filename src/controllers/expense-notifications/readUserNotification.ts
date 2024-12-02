import { emitNotification } from "../..";
import prisma from "../../helper/databaseConnection";

export async function ReadUserNotification(id: string) {

    
  if (id) {
    try {
      const result = await prisma.notification.findMany({
        where: {
          userId: id,
        },
      });
      emitNotification(id, {
        status: 200,
        message: "successful data notification via socket",
        result: result,
      });
    } catch (e) {
      emitNotification(id, {
        status: 400,
        message: "something break at database level to read notification",
        result: undefined,
      });
    }
  } else {
    emitNotification(id, {
      status: 400,
      message: "Wrong User Id",
      result: undefined,
    });
  }
}
