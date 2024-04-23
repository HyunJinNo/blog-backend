import express, { Request, Response, NextFunction } from "express";
import { router as apiRouter } from "./api";

export const router = express.Router();

// 라우터 설정
router.use("/api", apiRouter);

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("홈");
});
