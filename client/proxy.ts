import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  email?: string;
  user_id?: string;
  role?: string;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/auth/login", "/auth/verification", "/"];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/verification");

  if (isPublicRoute) {
    return NextResponse.next();
  }
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;

    const now = Math.floor(Date.now() / 1000);

    if (!decoded.exp || decoded.exp < now) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path", "/((?!_next|favicon.ico|public|.*\\..*).*)"],
};
