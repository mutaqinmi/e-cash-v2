import { Transaction } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import * as table from "@/src/db/schema";

interface Data {
    date: string;
    Total: number;
}

export async function GET(req: NextRequest){
    try {
        const transaction = await Transaction.get.all();

        if(!transaction){
            return NextResponse.json({
                message: "No transaction found",
            }, {
                status: 404
            });
        }

        const groupTransactionByDate = transaction.reduce((acc: { [key: string]: { sale: table.saleType, customer: table.customerType, employee: table.employeeType }[] }, curr) => {
            const saleDate = curr.sale.sale_date;
            if(!saleDate) return acc;

            const date = new Date(saleDate).toLocaleDateString();
            if(isNaN(new Date(saleDate).getTime())) return acc;

            if (!acc[date]) {
                acc[date] = [];
            }

            (acc[date] as any[]).push(curr);
            
            return acc;
        }, {} as { [key: string]: { sale: table.saleType, customer: table.customerType, employee: table.employeeType }[] });

        const chartData: Data[] = Object.keys(groupTransactionByDate).map((key) => {
            const total = groupTransactionByDate[key].reduce((acc, curr) => {
                return acc + curr.sale.total_price!;
            }, 0);

            return {
                date: key,
                Total: total
            };
        });

        const limitChartData = chartData.slice(0, 7);

        return NextResponse.json({
            data: limitChartData,
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