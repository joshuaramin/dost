import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      apiVersionInfo?: {
        requested: string | null;
        served: string;
        deprecated: boolean;
        sunsetDate?: string | null;
      };
    }
  }
}

type VersionConfig = {
  supported: string[];
  defaultVersion: string;
  deprecated?: Record<string, { sunsetDate?: string }>;
  headerName?: string;
  customHeader?: string;
  rejectUnsupported?: boolean;
};

export function createApiVersionMiddleware(config: VersionConfig) {
  const {
    supported,
    defaultVersion,
    deprecated = {},
    headerName = "x-api-version",
    customHeader,
    rejectUnsupported = true,
  } = config;

  const latestVersion = supported[supported.length - 1];

  return function apiVersionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let requested: string | null = null;
    const primaryHeader = req.headers[headerName.toLowerCase()] as
      | string
      | undefined;
    const secondaryHeader = customHeader
      ? (req.headers[customHeader.toLowerCase()] as string | undefined)
      : undefined;

    if (primaryHeader) requested = primaryHeader;
    else if (secondaryHeader) requested = secondaryHeader;

    let served = defaultVersion;
    let deprecatedFlag = false;
    let sunsetDate: string | null = null;

    if (requested) {
      if (supported.includes(requested)) served = requested;
      else {
        if (rejectUnsupported) {
          return res.status(400).json({
            error: {
              type: "invalid_api_version",
              message: `Unsupported API version: ${requested}`,
              supported_versions: supported,
              latest_version: latestVersion,
            },
          });
        }
        served = defaultVersion;
      }
    }

    if (deprecated[served]) {
      deprecatedFlag = true;
      sunsetDate = deprecated[served].sunsetDate ?? null;
    }

    const versionInfo = {
      requested,
      served,
      deprecated: deprecatedFlag,
      sunsetDate,
    };
    req.apiVersionInfo = versionInfo;
    res.locals.apiVersion = versionInfo;

    res.setHeader("X-API-Version", served);
    if (requested) res.setHeader("X-API-Version-Requested", requested);
    if (deprecatedFlag) {
      res.setHeader("X-API-Deprecated", "true");
      if (sunsetDate) res.setHeader("X-API-Sunset-Date", sunsetDate);
    }
    if (customHeader) res.setHeader(customHeader, served);

    next();
  };
}
