import express from "express";
import {
  getPostById,
  checkRequestBody,
  list,
  read,
  remove,
  update,
  write,
  checkOwnPost,
} from "../controllers/postsController";
import checkLoggedIn from "../middlewares/checkLoggedIn";

export const router = express.Router();

router.get("/", list);
router.post("/", checkLoggedIn, checkRequestBody, write);
router.get("/:id", getPostById, read);
router.delete("/:id", checkLoggedIn, getPostById, checkOwnPost, remove);
router.patch("/:id", checkLoggedIn, getPostById, checkOwnPost, update);
