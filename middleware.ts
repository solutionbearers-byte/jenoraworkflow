import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/register"];
const PUBLIC_API_ROUTES = ["/api/auth/login", "/api/org/register", "/api/org-requests"];
const SUPERADMIN_ROUTES = ["/superadmin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    SUPERADMIN_ROUTES.some(route => pathname.startsWith(route)) &&
    !user.is_super_admin
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};