import { NextResponse } from "next/server";

export function middleware(request: NextResponse) {
    // console.log(request)
    // console.log(request.url)
    return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
    // matcher: "/about/:path*",
    matcher: "/products/:path*",
}