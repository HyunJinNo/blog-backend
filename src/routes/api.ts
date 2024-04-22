import express, { Request, Response } from "express";
import { router as postsRouter } from "./posts";
import { router as authRouter } from "./auth";

export const router = express.Router();

router.use("/posts", postsRouter);
router.use("/auth", authRouter);
