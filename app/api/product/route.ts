import { Product } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
}

export async function GET(req: NextRequest){
    const search_query = req.nextUrl.searchParams.get("search");

    try {
        if(search_query !== null){
            const data = await Product.get.search(search_query);

            return NextResponse.json(data, {
                status: 200
            });
        }

        const data = await Product.get.all();

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
        // unstring price
        body.price = parseInt(body.price.toString().split(".").join(""));

        // insert new product
        await Product.create(body.product_name, body.price, body.stock);

        return NextResponse.json({
            message: "Barang berhasil ditambahkan"
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
        // unstring price
        body.price = parseInt(body.price.toString().split(".").join(""));

        // update product
        Product.update.data(body.product_id, body.product_name, body.price, body.stock);

        return NextResponse.json({
            message: "Barang berhasil diedit"
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
    const product_id = req.nextUrl.searchParams.get("product_id");

    try {
        if(product_id === null){
            return NextResponse.json({
                message: "ID barang invalid"
            }, {
                status: 400
            });
        }

        await Product.delete(parseInt(product_id));

        return NextResponse.json({
            message: "Barang berhasil dihapus"
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