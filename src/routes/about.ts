import express, { Request, Response, NextFunction } from "express";

export const router = express.Router();

router.get("/:name?", (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;

  // name의 존재 유무에 따라 다른 결과 출력
  res.send(name ? `${name}의 소개` : "소개");
});
