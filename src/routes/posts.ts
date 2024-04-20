import express from "express";
import {
  list,
  read,
  remove,
  replace,
  update,
  write,
} from "../controllers/postsController";

export const router = express.Router();

router.get("/", list);
router.post("/", write);
router.get("/:id", read);
router.delete("/:id", remove);
router.put("/:id", replace);
router.patch("/:id", update);
