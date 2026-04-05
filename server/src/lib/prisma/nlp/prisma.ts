import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/prisma/geospatial/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: "postgres://postgres:root@localhost:5432/nlp",
});
export const nlpdb = new PrismaClient({ adapter });
