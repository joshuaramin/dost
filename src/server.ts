import "dotenv/config";

import express from "express";

import RolesRouter from "@/routes/roles.routes";
import UserRouter from "@/routes/user.routes";
import PermissionRouter from "@/routes/permission.routes";
import ModuleRouter from "@/routes/module.routes";
import { createApiVersionMiddleware } from "./lib/api.middleware";
import { withAuth } from "./lib/helpers/useAuth";

export const app = express();

app.use(
  createApiVersionMiddleware({
    supported: ["2026-02-26"],
    defaultVersion: "2026-02-26",
    deprecated: {
      "2024-10-01": { sunsetDate: "2025-12-31" },
    },
  }),
);

app.use("/users", UserRouter);
app.use("/module", ModuleRouter);
// app.use("/maintenance/roles", RolesRouter);
// app.use("/maintenance/permission", PermissionRouter);

app.get("/test-version", withAuth, (req, res) => {
  res.json({
    message: "API versioning works!",
    api_version: req.apiVersionInfo,
  });
});

app.listen(3000, () => {
  console.log("HEllo world");
});
