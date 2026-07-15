import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./config/db.js";
import { AppError } from "./utils/errors.js";

import riadRoutes from "./routes/riadRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/riads", riadRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);

// Also mount under /api/backend so the API works whether or not the
// hosting proxy strips the /api/backend prefix.
app.use("/api/backend/riads", riadRoutes);
app.use("/api/backend/rooms", roomRoutes);
app.use("/api/backend/reservations", reservationRoutes);
app.use("/api/backend/auth", authRoutes);
app.get("/api/backend/health", (req, res) => res.json({ status: "ok" }));

const statsHandler = async (req, res, next) => {
  try {
    const [totalRiads, totalRooms, availableRooms, reservations] =
      await Promise.all([
        prisma.riad.count(),
        prisma.room.count(),
        prisma.room.count({ where: { available: true } }),
        prisma.reservation.count(),
      ]);
    res.json({ totalRiads, totalRooms, availableRooms, reservations });
  } catch (err) {
    next(err);
  }
};

app.get("/api/stats", statsHandler);
app.get("/api/backend/stats", statsHandler);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (statusCode === 500) console.error(err);
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    ...(err.details && { details: err.details }),
  });
});

export default app;
