import { Employee } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

interface RequestBody {
    employee_id: number;
    full_name: string;
    user_name: string;
    password: string;
    role: string;
}

export async function GET(req: NextRequest){
    const search_query = req.nextUrl.searchParams.get("search");
    const status = req.nextUrl.searchParams.get("status");

    try {
        // search employee
        if(search_query !== null){
            const data = await Employee.get.search(search_query);

            return NextResponse.json(data, {
                status: 200
            });
        }

        if(status){
            if(status === "false"){
                const data = await Employee.get.inactive();

                return NextResponse.json(data, {
                    status: 200
                });
            }
        }

        const data = await Employee.get.all();

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
        // hash password
        const hashed_password = await argon2.hash(body.password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });

        // create employee
        await Employee.create(body.full_name, body.user_name, hashed_password, body.role);

        return NextResponse.json({
            message: "Pegawai berhasil ditambahkan"
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
    const employee_id: number = req.nextUrl.searchParams.get("employee_id") as unknown as number;
    const status = req.nextUrl.searchParams.get("status");

    try {
        if(status){
            if(status === "true"){
                await Employee.update.status(employee_id, true);

                return NextResponse.json({
                    message: "Pegawai berhasil diaktifkan"
                }, {
                    status: 200
                });
            } else if(status === "false"){
                await Employee.update.status(employee_id, false);

                return NextResponse.json({
                    message: "Pegawai dinonaktifkan"
                }, {
                    status: 200
                });
            }
        }

        // update employee
        if(!body.password){
            await Employee.update.data(body.employee_id, body.full_name, body.user_name, body.role);
        } else {
             // hash password
            const hashed_password = await argon2.hash(body.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1
            });

            await Employee.update.password(body.employee_id, hashed_password);
        }

        return NextResponse.json({
            message: "Pegawai berhasil diedit"
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
    const employee_id = req.nextUrl.searchParams.get("employee_id");

    try {
        if(employee_id === null){
            return NextResponse.json({
                message: "ID pegawai invalid"
            }, {
                status: 400
            });
        }

        // delete employee
        await Employee.delete(parseInt(employee_id));

        return NextResponse.json({
            message: "Pegawai berhasil dihapus"
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