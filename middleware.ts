import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};

export default auth((request) => {
    if (!request.auth?.user) {
        const signInUrl = new URL("/signin", request.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (!request.auth.user.is_superuser) {
        return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }

    return NextResponse.next();
});
