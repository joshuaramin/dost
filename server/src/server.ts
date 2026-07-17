import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import expressRateLimiter from "express-rate-limit";
import endpoints from "express-list-endpoints";

dotenv.config();

//library
import { createApiVersionMiddleware } from "@/lib/common/middleware.ts/api.middleware";
import { responseWrapperMiddleware } from "@/lib/common/middleware.ts/reponse.middleware";
import { withAuth } from "@/lib/helpers/useAuth";

// routers
import RolesRouter from "@/routes/roles.routes";
import UserRouter from "@/routes/user.routes";
import AuthRouter from "@/routes/auth.routes";
import ResourceRouter from "@/routes/resource.routes";
import RegionRouter from "@/routes/geom.routes";
import NlpRouter from "@/routes/nlp.routes";
import OrganizationRouter from "@/routes/organization.routes";
import EducationResourceRouter from "@/routes/educational-resources.routes";
import SurveyRouter from "@/routes/survey.routes";
import { errorHandler } from "./lib/common/middleware.ts/errorHandler";

//bullmq
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { authQueue } from "./jobs/auth/auth.queue";

export const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(authQueue)],
  serverAdapter,
});

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
    limit: 1000,
    windowMs: 60000,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many request, Please try again",
  }),
);
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
    origin: ["http://localhost:3000"],
  }),
);

//bullmq route
app.use("/admin/queues", serverAdapter.getRouter());

//main routes
app.use(responseWrapperMiddleware);
app.use("/maintenance/users", UserRouter);
app.use("/maintenance/resource", ResourceRouter);
app.use("/maintenance/educational-resource", EducationResourceRouter);
app.use("/maintenance/survey", SurveyRouter);
app.use("/maintenance/roles", RolesRouter);
app.use("/auth", AuthRouter);
app.use("/maintenance/geospatial", RegionRouter);
app.use("/maintenance/nlp", NlpRouter);
app.use("/maintenance/organization", OrganizationRouter);

app.get("/test-version", withAuth, (req, res) => {
  res.json({
    message: "API versioning works!",
    api_version: req.apiVersionInfo,
  });
});
app.use(errorHandler);

console.log(endpoints(app));
app.listen(4000, () => {
  console.log(`Server is running at port http://localhost:4000/`);
});
