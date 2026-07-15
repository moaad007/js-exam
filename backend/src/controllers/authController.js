import prisma from "../config/db.js";
import { AppError, asyncHandler } from "../utils/errors.js";
import { adminSchema } from "../utils/validators.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";

export const login = asyncHandler(async (req, res) => {
  const parsed = adminSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new AppError("Invalid credentials", 401);
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

export const seedAdmin = asyncHandler(async (req, res) => {
  const parsed = adminSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const { email, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { email, password: hashed },
  });
  res.status(201).json({ id: admin.id, email: admin.email });
});

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }
  const token = header.split(" ")[1];
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
};
