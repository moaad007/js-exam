import "dotenv/config";
import prisma from "../src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  const riad1 = await prisma.riad.create({
    data: {
      name: "Riad La Perle",
      city: "Marrakech",
      address: "12 Derb Sidi Ahmed, Medina",
      description:
        "A beautifully restored traditional riad with a central courtyard and rooftop terrace.",
      pricePerNight: 1200,
      imageUrl:
        "https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?w=800",
      rooms: {
        create: [
          {
            name: "Room Jasmine",
            type: "Double",
            pricePerNight: 900,
            available: true,
          },
          {
            name: "Room Rose",
            type: "Single",
            pricePerNight: 600,
            available: true,
          },
          {
            name: "Suite Majorelle",
            type: "Suite",
            pricePerNight: 1500,
            available: true,
          },
        ],
      },
    },
  });

  const riad2 = await prisma.riad.create({
    data: {
      name: "Riad Le Jardin",
      city: "Marrakech",
      address: "5 Rue de la Kasbah",
      description:
        "Peaceful riad surrounded by lush gardens and a refreshing plunge pool.",
      pricePerNight: 1500,
      imageUrl:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      rooms: {
        create: [
          {
            name: "Room Palm",
            type: "Family",
            pricePerNight: 1800,
            available: true,
          },
          {
            name: "Room Olive",
            type: "Double",
            pricePerNight: 1000,
            available: false,
          },
        ],
      },
    },
  });

  const riad3 = await prisma.riad.create({
    data: {
      name: "Riad Azure",
      city: "Fes",
      address: "22 Boulevard Mohammed V",
      description:
        "Modern comfort meets Moroccan heritage in the heart of Fes.",
      pricePerNight: 1100,
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      rooms: {
        create: [
          {
            name: "Room Saffron",
            type: "Double",
            pricePerNight: 850,
            available: true,
          },
        ],
      },
    },
  });

  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@riad.com" },
    update: {},
    create: { email: "admin@riad.com", password: hashed },
  });

  console.log("Seed completed:", { riad1, riad2, riad3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
