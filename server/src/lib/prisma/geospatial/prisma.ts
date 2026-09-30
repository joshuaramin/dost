import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/prisma/geospatial/generated/prisma/client";

const connectionString = process.env.DATABASE_GEO_DB_URL;

if (!connectionString) {
  throw new Error("DATABASE_GEO_DB_URL is not defiend");
}

const adapter = new PrismaPg({
  connectionString,
});
export const geodb = new PrismaClient({ adapter });
