import { Request, Response, NextFunction } from "express";

// 로그인 상태를 확인하는 미들웨어
const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  next();
};

export default checkLoggedIn;
