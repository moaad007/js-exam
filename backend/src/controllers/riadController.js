import prisma from "../config/db.js";
import { AppError, asyncHandler } from "../utils/errors.js";
import { riadSchema } from "../utils/validators.js";

export const getRiads = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6, search = "", city = "" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (city) where.city = { contains: city, mode: "insensitive" };

  const [riads, total] = await Promise.all([
    prisma.riad.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.riad.count({ where }),
  ]);

  res.json({ data: riads, total, page: Number(page), limit: Number(limit) });
});

export const getRiad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const riad = await prisma.riad.findUnique({
    where: { id },
    include: { rooms: true },
  });
  if (!riad) throw new AppError("Riad not found", 404);
  res.json(riad);
});

export const createRiad = asyncHandler(async (req, res) => {
  const parsed = riadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const riad = await prisma.riad.create({ data: parsed.data });
  res.status(201).json(riad);
});

export const updateRiad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = riadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const existing = await prisma.riad.findUnique({ where: { id } });
  if (!existing) throw new AppError("Riad not found", 404);
  const riad = await prisma.riad.update({ where: { id }, data: parsed.data });
  res.json(riad);
});

export const deleteRiad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.riad.findUnique({ where: { id } });
  if (!existing) throw new AppError("Riad not found", 404);
  await prisma.riad.delete({ where: { id } });
  res.status(204).send();
});
