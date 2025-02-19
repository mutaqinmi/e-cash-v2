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
    const status = req.nextUrl.searchParams.get("status");

    try {
        if(search_query !== null){
            const data = await Product.get.search(search_query);

            return NextResponse.json(data, {
                status: 200
            });
        }

        if(status){
            if(status === "true"){
                const data = await Product.get.activeProduct();
    
                return NextResponse.json(data, {
                    status: 200
                });
            } else {
                const data = await Product.get.inactiveProduct();

                return NextResponse.json(data, {
                    status: 200
                });
            }
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
    const status = req.nextUrl.searchParams.get("status");
    const product_id: number | null = req.nextUrl.searchParams.get("product_id") as unknown as number;

    try {
        if(status){
            if(status === "true"){
                // update product status
                Product.update.status(product_id, true);
                
                return NextResponse.json({
                    message: "Barang berhasil dipulihkan"
                }, {
                    status: 200
                });
            } else {
                // update product status
                Product.update.status(product_id, false);

                return NextResponse.json({
                    message: "Barang diarsipkan"
                }, {
                    status: 200
                });
            }
        }

        // unstring price
        body.price = parseInt(body.price.toString().split(".").join(""));

        // update product
        Product.update.data(body.product_id, body.price, body.stock);

        return NextResponse.json({
            message: "Barang berhasil diedit"
        }, {
            status: 200
        });
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