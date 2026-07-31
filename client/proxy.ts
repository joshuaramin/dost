import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  user_id: string;
  email: string;
  role: string;
  permissions: string[];
}

const routePermissions: Record<string, string> = {
  "/dashboard/main/overview": "overview:read",

  "/dashboard/users": "user-management:read",

  "/dashboard/roles": "roles-and-permissions:read",

  "/dashboard/organizations": "organization-management:read",

  "/dashboard/educational-resources": "resource-management:read",

  "/dashboard/surveys": "survey-management:read",

  "/dashboard/reports": "generate-reports:read",

  "/dashboard/trends-and-topics": "trends-and-topics:read",

  "/dashboard/sentiment-analysis": "sentiment-analysis:read",

  "/dashboard/predictions": "predictions:read",

  "/dashboard/demographics": "demographics:read",

  "/dashboard/risk-zones": "risk-zones:read",

  "/dashboard/maps": "map:read",
};

function hasPermission(
  permissions: string[] = [],
  permission: string,
): boolean {
  return permissions.includes(permission);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/auth/login", "/auth/verification"];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/verification") ||
    pathname.startsWith("/educational-resources");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  console.log("COOKIE TOKEN");
  console.log(req.cookies.get("token")?.value);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing.");
    }

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS512"],
    }) as TokenPayload;

    console.log("DECODED TOKEN");
    console.log(decoded);

    console.log("JWT:", decoded);

    const now = Math.floor(Date.now() / 1000);

    if (!decoded.exp || decoded.exp < now) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!decoded.permissions) {
      console.error("JWT has no permissions");

      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (decoded.role === "Super Administrator") {
      return NextResponse.next();
    }

    const matchedRoute = Object.entries(routePermissions).find(([route]) =>
      pathname.startsWith(route),
    );

    if (!matchedRoute) {
      return NextResponse.next();
    }

    const [, requiredPermission] = matchedRoute;

    console.log({
      pathname,
      role: decoded.role,
      requiredPermission,
      permissions: decoded.permissions,
    });

    if (!hasPermission(decoded.permissions, requiredPermission)) {
      console.warn("Permission denied");

      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT VERIFY ERROR");
    console.error(error);

    return NextResponse.redirect(new URL("/auth/login", req.url));

    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
