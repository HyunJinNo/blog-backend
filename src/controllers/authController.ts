import { Request, Response, NextFunction } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import { User } from "../models/User";

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
    password: hashedPassword,
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
 */
export const login = async (req: Request, res: Response) => {};

/**
 * 로그인 상태 확인
 */
export const check = async (req: Request, res: Response) => {};

/**
 * 로그아웃
 */
export const logout = async (req: Request, res: Response) => {};
