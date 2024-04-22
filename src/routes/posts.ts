import express from "express";
import {
  checkId,
  checkRequestBody,
  list,
  read,
  remove,
  update,
  write,
} from "../controllers/postsController";

export const router = express.Router();

router.get("/", list);
router.post("/", checkRequestBody, write);
router.get("/:id", checkId, read);
router.delete("/:id", checkId, remove);
router.patch("/:id", checkId, update);
