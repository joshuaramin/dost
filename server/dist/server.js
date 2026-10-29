"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_rate_limit_1 = tslib_1.__importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const routes_1 = require("./utils/routes.js");
const api_middleware_1 = require("./lib/common/middleware.ts/api.middleware.js");
const useAuth_1 = require("./lib/helpers/useAuth.js");
const errorHandler_1 = require("./lib/common/middleware.ts/errorHandler");
const roles_routes_1 = tslib_1.__importDefault(require("./routes/roles.routes.js"));
const user_routes_1 = tslib_1.__importDefault(require("./routes/user.routes.js"));
const auth_routes_1 = tslib_1.__importDefault(require("./routes/auth.routes.js"));
const resource_routes_1 = tslib_1.__importDefault(require("./routes/resource.routes.js"));
const geom_routes_1 = tslib_1.__importDefault(require("./routes/geom.routes.js"));
const nlp_routes_1 = tslib_1.__importDefault(require("./routes/nlp.routes.js"));
const organization_routes_1 = tslib_1.__importDefault(require("./routes/organization.routes.js"));
const educational_resources_routes_1 = tslib_1.__importDefault(require("./routes/educational-resources.routes.js"));
const survey_routes_1 = tslib_1.__importDefault(require("./routes/survey.routes.js"));
const treatmenthub_routes_1 = tslib_1.__importDefault(require("./routes/treatmenthub.routes.js"));
const services_routes_1 = tslib_1.__importDefault(require("./routes/services.routes.js"));
const contribution_routes_1 = tslib_1.__importDefault(require("./routes/contribution.routes.js"));
const log_routes_1 = tslib_1.__importDefault(require("./routes/log.routes.js"));
const form_route_1 = tslib_1.__importDefault(require("./routes/form.route.js"));
const rewards_routes_1 = tslib_1.__importDefault(require("./routes/rewards.routes.js"));
exports.app = (0, express_1.default)();
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
exports.app.use((0, cors_1.default)({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
    origin: (origin, callback) => {
        // Permit requests without an Origin header, such as server-to-server calls.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
}));
exports.app.use((0, api_middleware_1.createApiVersionMiddleware)({
    supported: ["2026-02-26"],
    defaultVersion: "2026-02-26",
    deprecated: {
        "2024-10-01": {
            sunsetDate: "2025-12-31",
        },
    },
}));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, express_rate_limit_1.default)({
    limit: 1000,
    windowMs: 60_000,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many requests. Please try again.",
}));
/**
 * Health check
 * Does not require authentication or a database connection.
 */
exports.app.get("/", (_req, res) => {
    res.status(200).json({
        name: "DOST API",
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
/**
 * API version test
 */
exports.app.get("/test-version", useAuth_1.withAuth, (req, res) => {
    res.status(200).json({
        message: "API versioning works!",
        api_version: req.apiVersionInfo,
    });
});
/**
 * Route definitions
 */
const routeDefinitions = [
    { prefix: "/maintenance/contribution", router: contribution_routes_1.default },
    { prefix: "/maintenance/users", router: user_routes_1.default },
    { prefix: "/maintenance/resource", router: resource_routes_1.default },
    {
        prefix: "/maintenance/educational-resource",
        router: educational_resources_routes_1.default,
    },
    { prefix: "/maintenance/survey", router: survey_routes_1.default },
    { prefix: "/maintenance/roles", router: roles_routes_1.default },
    { prefix: "/auth", router: auth_routes_1.default },
    { prefix: "/maintenance/geospatial", router: geom_routes_1.default },
    { prefix: "/maintenance/services", router: services_routes_1.default },
    { prefix: "/maintenance/nlp", router: nlp_routes_1.default },
    { prefix: "/maintenance/organization", router: organization_routes_1.default },
    { prefix: "/maintenance/treatment-hub", router: treatmenthub_routes_1.default },
    { prefix: "/maintenance/activity-logs", router: log_routes_1.default },
    { prefix: "/maintenance/form", router: form_route_1.default },
    { prefix: "/maintenance/rewards", router: rewards_routes_1.default },
];
for (const { prefix, router } of routeDefinitions) {
    exports.app.use(prefix, router);
}
/**
 * Centralized error handler.
 * Must be registered after all routes.
 */
exports.app.use(errorHandler_1.errorHandler);
/**
 * Print routes for local debugging.
 */
if (process.env.NODE_ENV !== "production") {
    (0, routes_1.printEndpoints)(routeDefinitions);
}
exports.default = exports.app;
