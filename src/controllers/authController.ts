import { Request, Response, NextFunction } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/utils";

/**
 * Request Body 검증 미들웨어
 */
export const checkRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    if (typeof username === "string" && typeof password === "string") {
      next();
    } else {
      throw Error("Type Mismatch");
    }
  } catch (e) {
    res.sendStatus(400); // Bad Request
  }
};

/**
 * 회원가입
 *
 * POST /api/auth/register
 *
 * { username, password }
 */
export const register = async (req: Request, res: Response) => {
  const { username, password }: User = req.body;

  // username 이 이미 존재하는지 확인
  try {
    const [queryResult]: [Array<any>, any] = await pool.execute(
      `select * from user where username = "${username}";`,
    );
    if (queryResult.length !== 0) {
      throw Error("Duplicated username");
    }
  } catch (e) {
    res.sendStatus(409); // Conflict
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    username: username,
    password: password,
  };

  try {
    pool
      .execute(
        `insert into user (username, password) values ("${username}", "${hashedPassword}");`,
      )
      .then(() => res.json(user));
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * 로그인
 *
 * POST /api/auth/login
 *
 * { username, password }
 */
export const login = async (req: Request, res: Response) => {
  const { username, password }: User = req.body;

  try {
    const [queryResult]: [Array<any>, any] = await pool.execute(
      `select id, username, password from user where username = "${username}";`,
    );

    // 계정이 존재하지 않으면 에러 처리
    if (queryResult.length === 0) {
      throw Error("Unauthorized");
    }

    const valid = await bcrypt.compare(password, queryResult[0].password);

    // 잘못된 비밀번호
    if (!valid) {
      throw Error("Unauthorized");
    }

    const token = generateToken(queryResult[0].id, username);
    res.cookie("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
    res.json({
      username: username,
      password: password,
    });
  } catch (e) {
    res.sendStatus(401); // Unauthorized
  }
};

/**
 * 로그인 상태 확인
 *
 * GET /api/auth/check
 */
export const check = async (req: Request, res: Response) => {
  const user = res.locals.user;

  // 로그인 중이 아닌 경우
  if (!user) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  res.send(user);
};

/**
 * 로그아웃
 *
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  // 쿠키 삭제
  res.clearCookie("access_token");
  res.sendStatus(204); // No content
};
