import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    const token = req.cookies.get("token")?.value;

    console.log(token);

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/:path*'
    ]
}