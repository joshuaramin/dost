"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nlpdb = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../geospatial/generated/prisma/client.js");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: "postgres://postgres:root@localhost:5432/nlp",
});
exports.nlpdb = new client_1.PrismaClient({ adapter });
