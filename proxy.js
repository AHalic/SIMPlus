import { NextResponse } from "next/server";

export function proxy(request) {
  const cookieToken = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Skip proxy for these paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!cookieToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
