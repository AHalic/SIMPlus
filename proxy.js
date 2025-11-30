import { NextResponse } from "next/server";
import { RoleEnum } from "./models/Enum";

export function proxy(request) {
	const cookieToken = request.cookies.get("token")?.value;
	const userRole = request.cookies.get("role")?.value;
	const userId = request.cookies.get("user_id")?.value;
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

	// if user is associate block access to page users management and add items
	if (cookieToken && userRole === RoleEnum[1] && 
		((pathname.startsWith("/users") && pathname !== `/users/${userId}`) 
			|| pathname === "/items/new")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/:path*",
};
