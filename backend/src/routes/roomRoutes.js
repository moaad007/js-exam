import { Router } from "express";
import {
  getAllRooms,
  getRoomsByRiad,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { verifyToken } from "../controllers/authController.js";

const router = Router();

router.get("/", getAllRooms);
router.get("/:id/rooms", getRoomsByRiad);
router.post("/", verifyToken, createRoom);
router.put("/:id", verifyToken, updateRoom);
router.delete("/:id", verifyToken, deleteRoom);

export default router;
