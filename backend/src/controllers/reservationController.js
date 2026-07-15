import prisma from "../config/db.js";
import { AppError, asyncHandler } from "../utils/errors.js";
import { reservationSchema } from "../utils/validators.js";

const OVERLAP_QUERY = (roomId, start, end) => ({
  roomId,
  OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
});

export const createReservation = asyncHandler(async (req, res) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const { roomId, startDate, endDate, firstName, lastName, email, phone } =
    parsed.data;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < new Date(new Date().toDateString())) {
    throw new AppError("Start date cannot be in the past", 400);
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new AppError("Room not found", 404);

  const overlapping = await prisma.reservation.findFirst({
    where: {
      roomId,
      status: { not: "Cancelled" },
      OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
    },
  });

  if (overlapping) {
    throw new AppError("Room is not available for the selected dates", 409);
  }

  const client = await prisma.client.upsert({
    where: { email },
    update: { firstName, lastName, phone },
    create: { firstName, lastName, email, phone },
  });

  const reservationNumber = "RES-" + Date.now().toString(36).toUpperCase();

  const reservation = await prisma.reservation.create({
    data: {
      clientId: client.id,
      roomId,
      startDate: start,
      endDate: end,
      status: "Pending",
    },
    include: { client: true, room: true },
  });

  res.status(201).json({ reservationNumber, reservation });
});

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, room: { include: { riad: true } } },
  });
  res.json(reservations);
});

export const updateReservationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) throw new AppError("Reservation not found", 404);
  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status },
  });
  res.json(reservation);
});
