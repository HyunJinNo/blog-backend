import express, { Request, Response, NextFunction } from "express";
import { router as apiRouter } from "./api";

export const router = express.Router();

router.use("/api", apiRouter);

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("홈");
});
