import { Employee } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { Token } from "@/src/lib/jwt";

interface RequestBody {
    username: string;
    password: string;
}

export async function POST(req: NextRequest){
    const body: RequestBody = await req.json();

    try {
        const employee = await Employee.get.byUsername(body.username);

        if(employee === undefined){
            return NextResponse.json({
                message: "Gagal mengambil data administrator"
            }, {
                status: 500
            });
        }

        if(employee?.length === 0){
            return NextResponse.json({
                message: "Administrator tidak ditemukan"
            }, {
                status: 404
            });
        }

        const verified_password = await argon2.verify(employee[0].password!, body.password);

        if(!verified_password){
            return NextResponse.json({
                message: "Password salah"
            }, {
                status: 401
            });
        }

        const { password, ...dataEmployee } = employee[0];
        const token = Token.generate(dataEmployee);

        return NextResponse.json({
            message: "Login berhasil",
            data: {
                name: dataEmployee.full_name,
                role: dataEmployee.role,
            }
        }, {
            status: 200,
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Priority=High`
            }
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