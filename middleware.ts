import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type User = {
  isAdmin: boolean;
};

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  // If the user is authenticated and tries to access the login page, redirect to the home page
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to login page if the user tries to access authenticated routes without being authenticated
  if (
    (pathname === "/cart" ||
      pathname === "/order" ||
      pathname === "/dashboard" ||
      pathname === "/checkout") &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to the home page if the user tries to access the dashboard without being an admin
  if (
    pathname === "/dashboard" &&
    session &&
    !(session?.user as User).isAdmin
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Redirect to the home page if the user tries to access any dashboard route without being an admin
  if (
    pathname.startsWith("/dashboard") &&
    session &&
    !(session?.user as User).isAdmin
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Allow the request to proceed if it's an API route or if it's the home page
  if (pathname.startsWith("/api/") || pathname === "/") {
    return NextResponse.next();
  }

  // For all other cases, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/order",
    "/cart",
    "/dashboard",
    "/api/:path*",
    "/dashboard/:path*",
    "/checkout",
    "/checkout/:path*",
  ],
};
