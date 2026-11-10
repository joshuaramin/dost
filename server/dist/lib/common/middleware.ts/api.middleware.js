export function createApiVersionMiddleware(config) {
    const { supported, defaultVersion, deprecated = {}, headerName = "x-api-version", customHeader, rejectUnsupported = true, } = config;
    const latestVersion = supported[supported.length - 1];
    return function apiVersionMiddleware(req, res, next) {
        let requested = null;
        const primaryHeader = req.headers[headerName.toLowerCase()];
        const secondaryHeader = customHeader
            ? req.headers[customHeader.toLowerCase()]
            : undefined;
        if (primaryHeader)
            requested = primaryHeader;
        else if (secondaryHeader)
            requested = secondaryHeader;
        let served = defaultVersion;
        let deprecatedFlag = false;
        let sunsetDate = null;
        if (requested) {
            if (supported.includes(requested))
                served = requested;
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
        if (requested)
            res.setHeader("X-API-Version-Requested", requested);
        if (deprecatedFlag) {
            res.setHeader("X-API-Deprecated", "true");
            if (sunsetDate)
                res.setHeader("X-API-Sunset-Date", sunsetDate);
        }
        if (customHeader)
            res.setHeader(customHeader, served);
        next();
    };
}
