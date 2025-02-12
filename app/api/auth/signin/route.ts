import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    username: string;
    password: string;
}

export async function POST(req: NextRequest){
    const body: RequestBody = await req.json();

    try {
        console.log(body.username, body.password);

        return NextResponse.json({
            message: "login success"
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