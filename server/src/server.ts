import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import expressRateLimiter from "express-rate-limit";
import type { Request, Response } from "express";

dotenv.config();

import { printEndpoints } from "@/utils/routes";
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
import ActivityRouter from "@/routes/log.routes";
import FormRouter from "@/routes/form.route";
import RewardsRouter from "@/routes/rewards.routes";

export const app = express();

/**
 * CORS
 * Configure FRONTEND_URL in Vercel environment variables
 * with your deployed frontend origin.
 */
const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : []),
];

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
    origin: (origin, callback) => {
      // Permit requests without an Origin header, such as server-to-server calls.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
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
  expressRateLimiter({
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
