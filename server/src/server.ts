import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import type { Request, Response } from "express";

dotenv.config();

import { printEndpoints } from "./utils/routes.js";
import { createApiVersionMiddleware } from "./lib/common/middleware.ts/api.middleware.js";
import { responseWrapperMiddleware } from "./lib/common/middleware.ts/reponse.middleware.js";
import { withAuth } from "./lib/helpers/useAuth.js";
import { errorHandler } from "./lib/common/middleware.ts/errorHandler.js";

import RolesRouter from "./routes/roles.routes.js";
import UserRouter from "./routes/user.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import ResourceRouter from "./routes/resource.routes.js";
import RegionRouter from "./routes/geom.routes.js";
import NlpRouter from "./routes/nlp.routes.js";
import OrganizationRouter from "./routes/organization.routes.js";
import EducationResourceRouter from "./routes/educational-resources.routes.js";
import SurveyRouter from "./routes/survey.routes.js";
import TreatmentHubRouter from "./routes/treatmenthub.routes.js";
import ServiceRouter from "./routes/services.routes.js";
import ContributionRouter from "./routes/contribution.routes.js";
import ActivityRouter from "./routes/log.routes.js";
import FormRouter from "./routes/form.route.js";
import RewardsRouter from "./routes/rewards.routes.js";

export const app = express();

const normalizeOrigin = (value: string): string =>
  value.trim().replace(/\/+$/, "");

const allowedOrigins = new Set(
  ["http://localhost:3000", ...(process.env.FRONTEND_URL?.split(",") ?? [])]
    .map(normalizeOrigin)
    .filter(Boolean),
);

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-API-Version",
      "x-api-key",
    ],
    optionsSuccessStatus: 204,
  }),
);

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
  rateLimit({
    limit: 1000,
    windowMs: 60_000,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many requests. Please try again.",
  }),
);

/**
 * Health check
 * Does not require authentication or a database connection.
 */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "DOST API",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API version test
 */
app.get("/test-version", withAuth, (req: Request, res: Response) => {
  res.status(200).json({
    message: "API versioning works!",
    api_version: req.apiVersionInfo,
  });
});

/**
 * Route definitions
 */
const routeDefinitions = [
  { prefix: "/maintenance/contribution", router: ContributionRouter },
  { prefix: "/maintenance/users", router: UserRouter },
  { prefix: "/maintenance/resource", router: ResourceRouter },
  {
    prefix: "/maintenance/educational-resource",
    router: EducationResourceRouter,
  },
  { prefix: "/maintenance/survey", router: SurveyRouter },
  { prefix: "/maintenance/roles", router: RolesRouter },
  { prefix: "/auth", router: AuthRouter },
  { prefix: "/maintenance/geospatial", router: RegionRouter },
  { prefix: "/maintenance/services", router: ServiceRouter },
  { prefix: "/maintenance/nlp", router: NlpRouter },
  { prefix: "/maintenance/organization", router: OrganizationRouter },
  { prefix: "/maintenance/treatment-hub", router: TreatmentHubRouter },
  { prefix: "/maintenance/activity-logs", router: ActivityRouter },
  { prefix: "/maintenance/form", router: FormRouter },
  { prefix: "/maintenance/rewards", router: RewardsRouter },
] as const;

for (const { prefix, router } of routeDefinitions) {
  app.use(prefix, router);
}

/**
 * Centralized error handler.
 * Must be registered after all routes.
 */
app.use(errorHandler);

/**
 * Print routes for local debugging.
 */
if (process.env.NODE_ENV !== "production") {
  printEndpoints(routeDefinitions);
}

export default app;
