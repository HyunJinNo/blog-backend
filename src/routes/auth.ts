import express from "express";
import {
  check,
  checkRequestBody,
  login,
  logout,
  register,
} from "../controllers/authController";

export const router = express.Router();

router.post("/register", checkRequestBody, register);
router.post("/login", checkRequestBody, login);
router.get("/check", check);
router.post("/logout", checkRequestBody, logout);
