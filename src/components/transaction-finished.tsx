import { formatCurrency } from "../lib/number-formatter";
import Button from "./button";
import * as table from "@/src/db/schema";

export default function TransactionFinished(props: {popupController?: (show: boolean | null) => void; data: table.saleType}){
    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <h1 className="text-xl font-semibold">Transaksi Berhasil!</h1>
            <div className="my-4">
                <span className="block font-semibold">Detail Transaksi</span>
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Tanggal Transaksi</span>
                    <span>{props.data.sale_date}</span>
                </div>
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">ID Transaksi</span>
                    <span>{props.data.sale_id}</span>
                </div>
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Pajak</span>
                    <span>12%</span>
                </div>
                {props.data.customer_id ? <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Diskon Member</span>
                    <span>5%</span>
                </div> : null}
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Total</span>
                    <span>{formatCurrency(props.data.total_price!)}</span>
                </div>
            </div>
            <div className="mt-4 flex justify-end items-center gap-2">
                <Button className="py-2" label="Tutup" onClick={() => props.popupController!(false)}></Button>
            </div>
        </div>
    </div>
}