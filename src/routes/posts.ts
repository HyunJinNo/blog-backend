import express from "express";
import {
  list,
  read,
  remove,
  update,
  write,
} from "../controllers/postsController";

export const router = express.Router();

router.get("/", list);
router.post("/", write);
router.get("/:id", read);
router.delete("/:id", remove);
router.patch("/:id", update);
