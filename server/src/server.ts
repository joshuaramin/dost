import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import expressRateLimiter from "express-rate-limit";
import http from "node:http";

import { printEndpoints } from "@/utils/routes";

dotenv.config();

import { createApiVersionMiddleware } from "@/lib/common/middleware.ts/api.middleware";
import { responseWrapperMiddleware } from "@/lib/common/middleware.ts/reponse.middleware";
import { withAuth } from "@/lib/helpers/useAuth";
import { errorHandler } from "./lib/common/middleware.ts/errorHandler";

import RolesRouter from "@/routes/roles.routes";
import UserRouter from "@/routes/user.routes";
import AuthRouter from "@/routes/auth.routes";
import ResourceRouter from "@/routes/resource.routes";
import RegionRouter from "@/routes/geom.routes";
import NlpRouter from "@/routes/nlp.routes";
import OrganizationRouter from "@/routes/organization.routes";
import EducationResourceRouter from "@/routes/educational-resources.routes";
import SurveyRouter from "@/routes/survey.routes";
import TreatmentHubRouter from "@/routes/treatmenthub.routes";
import ServiceRouter from "@/routes/services.routes";
import ContributionRouter from "@/routes/contribution.routes";

import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { authQueue } from "./jobs/auth/auth.queue";
import { initializeSocket } from "./sockets";

export const app = express();

const httpServer = http.createServer(app);

initializeSocket(httpServer);

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
      "2024-10-01": {
        sunsetDate: "2025-12-31",
      },
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

app.use("/admin/queues", serverAdapter.getRouter());

app.use(responseWrapperMiddleware);

const routeDefinitions = [
  {
    prefix: "/maintenance/contribution",
    router: ContributionRouter,
  },
  {
    prefix: "/maintenance/users",
    router: UserRouter,
  },
  {
    prefix: "/maintenance/resource",
    router: ResourceRouter,
  },
  {
    prefix: "/maintenance/educational-resource",
    router: EducationResourceRouter,
  },
  {
    prefix: "/maintenance/survey",
    router: SurveyRouter,
  },
  {
    prefix: "/maintenance/roles",
    router: RolesRouter,
  },
  {
    prefix: "/auth",
    router: AuthRouter,
  },
  {
    prefix: "/maintenance/geospatial",
    router: RegionRouter,
  },
  {
    prefix: "/maintenance/services",
    router: ServiceRouter,
  },
  {
    prefix: "/maintenance/nlp",
    router: NlpRouter,
  },
  {
    prefix: "/maintenance/organization",
    router: OrganizationRouter,
  },
  {
    prefix: "/maintenance/treatment-hub",
    router: TreatmentHubRouter,
  },
] as const;

for (const { prefix, router } of routeDefinitions) {
  app.use(prefix, router);
}

app.get("/test-version", withAuth, (req, res) => {
  res.json({
    message: "API versioning works!",
    api_version: req.apiVersionInfo,
  });
});

app.use(errorHandler);

printEndpoints(routeDefinitions);

httpServer.listen(4000, () => {
  console.log("Server is running at http://localhost:4000/");
});
