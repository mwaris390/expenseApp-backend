import { Request, Response } from "express";
import path from "path";
export async function ReadUserFilename(req: Request, res: Response) {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../public/user-image",filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: "File not found" });
    }
  });
}
