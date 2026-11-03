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
export const getRouterEndpoints = (router, prefix) => {
    return walkRouter(getRouterStack(router), prefix);
};
export const getEndpoints = (routeDefinitions) => {
    return routeDefinitions.flatMap(({ router, prefix }) => getRouterEndpoints(router, prefix));
};
export const printEndpoints = (routeDefinitions) => {
    const routes = getEndpoints(routeDefinitions);
    console.table(routes);
};
