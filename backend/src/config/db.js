import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Always reuse a single client across warm serverless invocations.
// (Re-attaching only in non-production was creating a new pool per cold
// start on Vercel, exhausting the Postgres connection limit.)
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Keep each instance's pool tiny — Clever Cloud pools connections for us,
    // and serverless spins up many concurrent instances.
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ["error", "warn"],
  });

globalForPrisma.prisma = prisma;

export default prisma;
