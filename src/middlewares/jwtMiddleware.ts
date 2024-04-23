import { Request, Response, NextFunction, request } from "express";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/utils";

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["access_token"];
  if (!token) {
    return next(); // 토큰이 없음
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.locals.user = decoded;

    // 토큰의 남은 유효 기간이 3.5일 미만이면 재발급
    const now = Math.floor(Date.now() / 1000);
    if (res.locals.user.exp - now < 60 * 60 * 25 * 3.5) {
      const newToken = generateToken(
        res.locals.user.id,
        res.locals.user.username,
      );
      res.cookie("access_token", newToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        httpOnly: true,
      });
    }

    next();
  } catch (e) {
    // 토큰 검증 실패;
    next();
  }
};

export default jwtMiddleware;
