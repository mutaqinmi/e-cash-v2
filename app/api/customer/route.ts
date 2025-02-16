import { Customer } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    customer_id: number,
    customer_name: string,
    customer_address: string,
    phone_number: string,
}

export async function GET(req: NextRequest){
    const search_query = req.nextUrl.searchParams.get("search");

    try {
        if(search_query !== null){
            const data = await Customer.get.search(search_query);

            return NextResponse.json(data, {
                status: 200
            });
        }

        const data = await Customer.get.all();

        return NextResponse.json(data, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}

export async function POST(req: NextRequest){
    const body: RequestBody = await req.json();

    try {
        // format phone number
        body.phone_number = body.phone_number.replace("+62 ", "0");

        // insert new customer
        await Customer.create(body.customer_name, body.customer_address, body.phone_number);

        return NextResponse.json({
            message: "Pelanggan berhasil ditambahkan"
        }, {
            status: 201
        });
    } catch (error) {
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}

export async function PATCH(req: NextRequest){
    const body: RequestBody = await req.json();

    try {
        // format phone number
        body.phone_number = body.phone_number.replace("+62 ", "0").replace(" ", "").replace("-", "");

        // update customer
        await Customer.update(body.customer_id, body.customer_name, body.customer_address, body.phone_number);

        return NextResponse.json({
            message: "Pelanggan berhasil diedit"
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}

export async function DELETE(req: NextRequest){
    const customer_id = req.nextUrl.searchParams.get("customer_id");

    try {
        if(customer_id === null){
            return NextResponse.json({
                message: "ID pelanggan invalid"
            }, {
                status: 400
            });
        }

        // delete employee
        await Customer.delete(parseInt(customer_id));

        return NextResponse.json({
            message: "Pelanggan berhasil dihapus"
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}