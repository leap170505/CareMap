import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "super-secret-key-for-dev-only";
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to authentication pages, API endpoints, and the Home page
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") || // Next.js static files
    pathname.includes(".") // Other static files (favicon.ico, etc.)
  ) {
    return NextResponse.next();
  }

  // Check for the session cookie
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    // Not logged in -> Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(sessionCookie, key, {
      algorithms: ["HS256"],
    });

    // Check Admin specific routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (payload.role !== "ADMIN") {
        // User is logged in but is NOT an admin, redirect them back to Home
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Token is valid and they have appropriate access
    return NextResponse.next();
  } catch (err) {
    // Token is invalid or expired
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

// Run the middleware on everything
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
