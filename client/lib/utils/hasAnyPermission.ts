import store from "store2";

const getUserPermissions = () => {
  const data = store.get("data_sessions");

  console.log(data);
  return data?.data?.Role.permission ?? [];
};

const matchPath = (pathname: string, allowedPaths: string[]): boolean => {
  return allowedPaths.some((path) => {
    if (path.endsWith("*")) {
      const basePath = path.slice(0, -1);
      return pathname.startsWith(basePath);
    }
    return pathname === path;
  });
};

export const hasPermission = (
  requiredPermissions: string[],
  pathname?: string,
  allowedPaths?: string[],
): boolean => {
  const userPermissions = getUserPermissions();

  if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.every((permission) => {
    if (!userPermissions.includes(permission)) return false;
    if (!pathname) return true;
    if (allowedPaths && !matchPath(pathname, allowedPaths)) return false;
    return true;
  });
};

export const hasAnyPermission = (
  requiredPermissions: string[],
  pathname?: string,
  allowedPaths?: string[],
): boolean => {
  const userPermissions = getUserPermissions();

  if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    return true;
  }

  if (!pathname)
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

  if (allowedPaths && !matchPath(pathname, allowedPaths)) return false;

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
};
