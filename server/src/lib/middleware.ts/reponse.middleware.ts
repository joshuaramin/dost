import { Request, Response, NextFunction } from "express";

export function responseWrapperMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
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
