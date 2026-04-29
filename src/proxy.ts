import { auth } from "@/authentication";
import { NextResponse } from "next/server";

// Middleware to handle authentication, authorization, and route protection
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.admin;
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users to the welcome page
  if (!isLoggedIn && pathname !== "/welcome") {
    return NextResponse.redirect(new URL("/welcome", req.nextUrl));
  }

  // Redirect authenticated users away from the welcome page
  if (isLoggedIn && pathname === "/welcome") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Restrict access to admin routes for non-admin users
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

// Define which routes should be processed by the middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|face.jpg|faces|.*\\..*).*)",
  ],
};
