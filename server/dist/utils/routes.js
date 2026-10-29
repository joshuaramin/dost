"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printEndpoints = exports.getEndpoints = exports.getRouterEndpoints = void 0;
const normalizePath = (path) => {
    if (!path) {
        return "/";
    }
    if (path === "/") {
        return "/";
    }
    return path.replace(/\/+$/, "");
};
const combinePaths = (prefix, path) => {
    const normalizedPrefix = normalizePath(prefix);
    const normalizedPath = path === "/" ? "" : path;
    if (normalizedPrefix === "/") {
        return normalizedPath || "/";
    }
    return `${normalizedPrefix}${normalizedPath}`;
};
const getRouterStack = (router) => {
    const internalRouter = router;
    return internalRouter.stack ?? [];
};
const walkRouter = (stack, prefix) => {
    const routes = [];
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
const getRouterEndpoints = (router, prefix) => {
    return walkRouter(getRouterStack(router), prefix);
};
exports.getRouterEndpoints = getRouterEndpoints;
const getEndpoints = (routeDefinitions) => {
    return routeDefinitions.flatMap(({ router, prefix }) => (0, exports.getRouterEndpoints)(router, prefix));
};
exports.getEndpoints = getEndpoints;
const printEndpoints = (routeDefinitions) => {
    const routes = (0, exports.getEndpoints)(routeDefinitions);
    console.table(routes);
};
exports.printEndpoints = printEndpoints;
