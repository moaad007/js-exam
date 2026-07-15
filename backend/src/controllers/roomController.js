import prisma from "../config/db.js";
import { AppError, asyncHandler } from "../utils/errors.js";
import { roomSchema } from "../utils/validators.js";

export const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
    include: { riad: { select: { id: true, name: true, city: true } } },
  });
  res.json(rooms);
});

export const getRoomsByRiad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rooms = await prisma.room.findMany({
    where: { riadId: id },
    orderBy: { name: "asc" },
  });
  res.json(rooms);
});

export const createRoom = asyncHandler(async (req, res) => {
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const riad = await prisma.riad.findUnique({
    where: { id: parsed.data.riadId },
  });
  if (!riad) throw new AppError("Riad not found", 404);
  const room = await prisma.room.create({ data: parsed.data });
  res.status(201).json(room);
});

export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = roomSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) throw new AppError("Room not found", 404);
  const room = await prisma.room.update({ where: { id }, data: parsed.data });
  res.json(room);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) throw new AppError("Room not found", 404);
  await prisma.room.delete({ where: { id } });
  res.status(204).send();
});
