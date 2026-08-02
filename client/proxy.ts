import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  user_id: string;
  email: string;
  role: string;
  permissions: string[];
}

function getRequiredPermission(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  if (segments[0] !== "dashboard") {
    return null;
  }

  return `${segments[1]}:read`;
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
    req.cookies.get("token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");

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

    const now = Math.floor(Date.now() / 1000);

    if (!decoded.exp || decoded.exp < now) {
      const response = NextResponse.redirect(new URL("/auth/login", req.url));

      response.cookies.delete("token");

      return response;
    }

    if (!decoded.permissions) {
      const response = NextResponse.redirect(new URL("/auth/login", req.url));

      response.cookies.delete("token");

      return response;
    }

    // Super Admin bypass
    if (decoded.role === "Super Administrator") {
      return NextResponse.next();
    }

    const requiredPermission = getRequiredPermission(pathname);

    if (
      requiredPermission &&
      !decoded.permissions.includes(requiredPermission)
    ) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);

    const response = NextResponse.redirect(new URL("/auth/login", req.url));

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
