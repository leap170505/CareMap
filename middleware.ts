import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "super-secret-key-for-dev-only";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We are protecting the /admin and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      // Not logged in
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify token
      const { payload } = await jwtVerify(sessionCookie, key, {
        algorithms: ["HS256"],
      });

      // Ensure user has ADMIN role
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Token is valid and user is admin, allow request to continue
      return NextResponse.next();
    } catch (err) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // All other routes are public
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
