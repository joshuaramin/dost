import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/prisma/system/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: "postgres://postgres:root@localhost:5432/dost",
});
export const prisma = new PrismaClient({ adapter });
