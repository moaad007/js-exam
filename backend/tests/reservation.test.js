import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/db.js";

let riad;
let room;

before(async () => {
  riad = await prisma.riad.create({
    data: {
      name: "Test Riad",
      city: "Test City",
      address: "Test Address",
      description: "Test Description",
      pricePerNight: 1000,
      imageUrl: "https://example.com/img.jpg",
      rooms: {
        create: [
          { name: "Test Room", type: "Double", pricePerNight: 800, available: true },
        ],
      },
    },
    include: { rooms: true },
  });
  room = riad.rooms[0];
});

after(async () => {
  await prisma.reservation.deleteMany({ where: { roomId: room.id } });
  await prisma.room.deleteMany({ where: { riadId: riad.id } });
  await prisma.riad.deleteMany({ where: { id: riad.id } });
  await prisma.$disconnect();
});

test("creates a reservation when room is available", async () => {
  const res = await request(app)
    .post("/api/reservations")
    .send({
      roomId: room.id,
      startDate: "2027-08-01",
      endDate: "2027-08-05",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+212600000000",
    });
  assert.equal(res.status, 201);
  assert.ok(res.body.reservationNumber);
  assert.equal(res.body.reservation.roomId, room.id);
});

test("rejects overlapping reservation with 409 Conflict", async () => {
  const res = await request(app)
    .post("/api/reservations")
    .send({
      roomId: room.id,
      startDate: "2027-08-03",
      endDate: "2027-08-08",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "+212600000001",
    });
  assert.equal(res.status, 409);
});

test("rejects reservation with end date before start date", async () => {
  const res = await request(app)
    .post("/api/reservations")
    .send({
      roomId: room.id,
      startDate: "2027-09-10",
      endDate: "2027-09-05",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane2@example.com",
      phone: "+212600000002",
    });
  assert.equal(res.status, 400);
});
