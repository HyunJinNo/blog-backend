import express, { Request, Response } from "express";
import { router as postsRouter } from "./posts";

export const router = express.Router();
router.use("/posts", postsRouter);

router.get("/test", (req: Request, res: Response) => {
  res.send("test 성공");
});
