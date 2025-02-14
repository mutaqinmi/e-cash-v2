import { Token } from "@/src/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    token: string;
}

export async function POST(req: NextRequest) {
    const body: RequestBody = await req.json();

    try {
        const verifiedUser = Token.verify(body.token);

        return NextResponse.json({
            data: verifiedUser
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}