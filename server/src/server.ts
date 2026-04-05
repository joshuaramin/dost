import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import expressRateLimiter from "express-rate-limit";

dotenv.config();

//library
import { createApiVersionMiddleware } from "@/lib/middleware.ts/api.middleware";
import { responseWrapperMiddleware } from "@/lib/middleware.ts/reponse.middleware";
import { withAuth } from "@/lib/helpers/useAuth";

// routers
import RolesRouter from "@/routes/roles.routes";
import UserRouter from "@/routes/user.routes";
import AuthRouter from "@/routes/auth.routes";
import ResourceRouter from "@/routes/resource.routes";
import RegionRouter from "@/routes/geom.routes";
import NlpRouter from "@/routes/nlp.routes";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressRateLimiter({
    limit: 10,
    windowMs: 60000,
    message: "Too many request, Please try again",
  }),
);
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTION"],
    origin: ["http://localhost:3000"],
  }),
);
app.use(responseWrapperMiddleware);
app.use("/maintenance/users", UserRouter);
app.use("/maintenance/resource", ResourceRouter);
app.use("/maintenance/roles", RolesRouter);
app.use("/auth", AuthRouter);
app.use("/maintenance/regions", RegionRouter);
app.use("/maintenance/nlp", NlpRouter);
app.get("/test-version", withAuth, (req, res) => {
  res.json({
    message: "API versioning works!",
    api_version: req.apiVersionInfo,
  });
});

app.listen(4000, () => {
  console.log(`Server is running at port http://localhost:4000/`);
});
