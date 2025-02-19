import { Transaction } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const sale_id: number = req.nextUrl.searchParams.get("sale_id") as unknown as number;

    try {
        const saleDetail = await Transaction.get.saleDetail(sale_id);
        
        return NextResponse.json({
            data: saleDetail
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