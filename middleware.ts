import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const config = {
    matcher: ["/admin/:path*"],
};

export default auth((request) => {
    if (!request.auth?.user) {
        const signInUrl = new URL("/signin", request.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
});
