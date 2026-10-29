export function responseWrapperMiddleware(req, res, next) {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
        const meta = {
            api_version: req.apiVersionInfo?.served,
            requested_version: req.apiVersionInfo?.requested,
            deprecated: req.apiVersionInfo?.deprecated ?? false,
            sunset_date: req.apiVersionInfo?.sunsetDate ?? null,
            timestamp: new Date().toISOString(),
            query: req.query,
            path: req.path,
            method: req.method,
            status: res.statusCode,
        };
        return originalJson({
            meta,
            data: body,
        });
    };
    next();
}
