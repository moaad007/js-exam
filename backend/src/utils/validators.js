import { z } from "zod";

const ROOM_TYPES = ["Single", "Double", "Suite", "Family"];

export const riadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  pricePerNight: z.number().positive("Price must be greater than zero"),
  imageUrl: z.string().url("Invalid image URL"),
});

export const roomSchema = z.object({
  riadId: z.string().min(1, "Riad is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(ROOM_TYPES, { message: "Invalid room type" }),
  pricePerNight: z.number().positive("Price must be greater than zero"),
  available: z.boolean().optional(),
});

export const reservationSchema = z
  .object({
    roomId: z.string().min(1, "Room is required"),
    startDate: z.string(),
    endDate: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ROOM_TYPES_LIST = ROOM_TYPES;
