import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const authRoutes = ["/login", "/signup"];
const protectedRoutes = ["/dashboard"];

export const { auth: middlewareAuth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await middlewareAuth();
  // console.log("Session in middleware:", session);

  // Check if it's an auth route (login/registration)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // If not authenticated, redirect to login
    if (!session) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }

    return NextResponse.next();
  }

  // If the route is neither auth nor protected, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.png$).*)", // Your existing matcher
    "/api/:path*", // Add API routes
  ],
};
