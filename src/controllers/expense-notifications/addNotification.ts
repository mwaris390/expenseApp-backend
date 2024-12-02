import prisma from "../../helper/databaseConnection";

export async function addNotification(title: string, desc: string, userId: string) {
  return await prisma.notification.create({
    data: {
      title,
      description: desc,
      userId,
    },
  });
}
