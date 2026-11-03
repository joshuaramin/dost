import type { Express, Router } from "express";

export interface RouteInfo {
  method: string;
  path: string;
}

export interface RouteDefinition {
  prefix: string;
  router: Router;
}

interface RouterLayer {
  route?: {
    path: string | string[];
    methods: Record<string, boolean>;
  };
  handle?: {
    stack?: RouterLayer[];
  };
}

const normalizePath = (path: string): string => {
  if (!path) {
    return "/";
  }

  if (path === "/") {
    return "/";
  }

  return path.replace(/\/+$/, "");
};

const combinePaths = (prefix: string, path: string): string => {
  const normalizedPrefix = normalizePath(prefix);
  const normalizedPath = path === "/" ? "" : path;

  if (normalizedPrefix === "/") {
    return normalizedPath || "/";
  }

  return `${normalizedPrefix}${normalizedPath}`;
};

const getRouterStack = (router: Router): RouterLayer[] => {
  const internalRouter = router as Router & {
    stack?: RouterLayer[];
  };

  return internalRouter.stack ?? [];
};

const walkRouter = (stack: RouterLayer[], prefix: string): RouteInfo[] => {
  const routes: RouteInfo[] = [];

  for (const layer of stack) {
    if (layer.route) {
      const paths = Array.isArray(layer.route.path)
        ? layer.route.path
        : [layer.route.path];

      const methods = Object.entries(layer.route.methods)
        .filter(([, enabled]) => enabled)
        .map(([method]) => method.toUpperCase());

      for (const path of paths) {
        routes.push({
          method: methods.join(", "),
          path: combinePaths(prefix, path),
        });
      }

      continue;
    }

    if (layer.handle?.stack) {
      routes.push(...walkRouter(layer.handle.stack, prefix));
    }
  }

  return routes;
};

export const getRouterEndpoints = (
  router: Router,
  prefix: string,
): RouteInfo[] => {
  return walkRouter(getRouterStack(router), prefix);
};

export const getEndpoints = (
  routeDefinitions: readonly RouteDefinition[],
): RouteInfo[] => {
  return routeDefinitions.flatMap(({ router, prefix }) =>
    getRouterEndpoints(router, prefix),
  );
};

export const printEndpoints = (
  routeDefinitions: readonly RouteDefinition[],
): void => {
  const routes = getEndpoints(routeDefinitions);

  console.table(routes);
};
