"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geodb = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("./generated/prisma/client.js");
const connectionString = process.env.DATABASE_GEO_DB_URL;
if (!connectionString) {
    throw new Error("DATABASE_GEO_DB_URL is not defiend");
}
const adapter = new adapter_pg_1.PrismaPg({
    connectionString,
});
exports.geodb = new client_1.PrismaClient({ adapter });
