import { PrismaClient } from "@/lib/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connecteionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
