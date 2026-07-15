import { Router } from "express";
import {
  getRiads,
  getRiad,
  createRiad,
  updateRiad,
  deleteRiad,
} from "../controllers/riadController.js";
import { verifyToken } from "../controllers/authController.js";

const router = Router();

router.get("/", getRiads);
router.get("/:id", getRiad);
router.post("/", verifyToken, createRiad);
router.put("/:id", verifyToken, updateRiad);
router.delete("/:id", verifyToken, deleteRiad);

export default router;
