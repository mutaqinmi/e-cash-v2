import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){
    const token = req.cookies.get("token")?.value;

    if (!token && req.nextUrl.pathname !== "/signin"){
        return NextResponse.rewrite(new URL('/signin', req.url))
    }

    const authenticatedUser: AxiosResponse = await axios.post(`${process.env.API_URL}/auth`, {
        token
    }, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res).catch(err => err.response);
    
    if (token && req.nextUrl.pathname === ("/signin")){
        if (authenticatedUser.data.data.role === "Administrator"){
            return NextResponse.rewrite(new URL('/admin', req.url));
        } else if(authenticatedUser.data.data.role === "Kasir") {
            return NextResponse.rewrite(new URL('/cashier', req.url));
        }
    } else if (token && req.nextUrl.pathname === ("/admin") && authenticatedUser.data.data.role !== "Administrator"){
        return NextResponse.rewrite(new URL('/cashier', req.url));
    } else if (token && req.nextUrl.pathname === ("/cashier") && authenticatedUser.data.data.role !== "Kasir"){
        return NextResponse.rewrite(new URL('/admin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/signin/:path*',
        '/admin/:path*',
        '/cashier/:path*'
    ]
}