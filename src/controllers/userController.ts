import { Request, Response, NextFunction } from "express";
import pool from "../db/db";

type User = {
  username: string;
  password: string;
};

export const list = (req: Request, res: Response, next: NextFunction) => {};
