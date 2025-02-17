import { Transaction } from "@/src/db/query";
import { Token } from "@/src/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface ProductItem {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    quantity: number;
    subtotal: number;
} 

interface RequestBody {
    cart: ProductItem[];
    total: number;
    customer_id: number;
}

interface Payload extends JwtPayload {
    employee_id: number;
    full_name: string;
    user_name: string;
    role: string;
}

export async function POST(req: NextRequest){
    const body: RequestBody = await req.json();
    const token = req.cookies.get("token")?.value;

    try {
        if(!token){
            return NextResponse.json({
                message: "Unauthorized",
            }, {
                status: 401,
            });
        }

        const payload: Payload = Token.verify(token) as Payload;
        const employee_id: number = payload.employee_id;

        const transaction = await Transaction.create.newTransaction(body.total, body.customer_id, employee_id);

        if(!transaction){
            return NextResponse.json({
                message: "Transaksi gagal",
            }, {
                status: 500,
            });
        }

        await Transaction.create.detailTransaction(transaction[0].sale_id, body.cart);

        return NextResponse.json({
            message: "Transaksi berhasil",
        }, {
            status: 200,
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}