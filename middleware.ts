import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const config = {
    matcher: "/api/:path*",
};

export default function middleware(request: NextRequest) {   
    return NextResponse.next()
};

export { auth as middleware } from "@/auth"