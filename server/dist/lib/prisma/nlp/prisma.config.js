import "dotenv/config";
import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: "schema.prisma",
    migrations: {
        path: "migrations",
    },
    datasource: {
        url: "postgres://postgres:root@localhost:5432/nlp",
    },
});
