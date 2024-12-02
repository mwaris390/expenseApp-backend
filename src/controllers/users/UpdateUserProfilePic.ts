import { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import prisma from "../../helper/databaseConnection";
import { emitNotification } from "../..";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/user-image");
  },
  filename(req, file, callback) {
    const { id } = req.body;
    const filename = file.originalname.split(".");
    callback(null, filename[0] + "_" + id + "." + filename[1]);
  },
});
const file = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error("Invalid file type. Only jpg, jpeg, and png are allowed.")
      );
    }
  },
  limits: {
    fileSize: 4000000,
  },
});
const fileUpload = file.single("file");
export async function UpdateUserProfilePic(req: Request, res: Response) {
  fileUpload(req, res, async (err) => {
    if (err) {
      AddLogs(req.url, 400, JSON.stringify(req.file), err, res);
    }
    try {
      const { id } = req.body;

      const result = await prisma.user.update({
        data: {
          pic: req.file?.filename,
          notifications: {
            create: {
              title: "Update",
              description: `You have change your profile Pic.`,
            },
          },
        },
        where: {
          id: id,
        },
        include: {
          notifications: true,
        },
      });
      emitNotification(id, {
        status: 200,
        message: "successful data notification via socket",
        result: result.notifications,
      });
      return res
        .status(200)
        .json(GenerateSuccessJSON("Successfully added image", result));
    } catch (e) {
      if (req.file?.path) {
        fs.unlink(req.file?.path, (err) => {
          if (err) {
            AddLogs(req.url, 400, JSON.stringify(req.file), err, res);
          }
        });
      }
      AddLogs(req.url, 400, JSON.stringify(req.file), e, res);
    }
  });
}
