import { Router } from "express";
import {
  createReservation,
  getReservations,
  updateReservationStatus,
} from "../controllers/reservationController.js";
import { verifyToken } from "../controllers/authController.js";

const router = Router();

router.post("/", createReservation);
router.get("/", verifyToken, getReservations);
router.patch("/:id", verifyToken, updateReservationStatus);

export default router;
