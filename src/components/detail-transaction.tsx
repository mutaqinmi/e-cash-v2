import { X } from "@phosphor-icons/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import * as table from '@/src/db/schema';
import LoadingSpin from "./loading-spin";
import { formatCurrency } from "../lib/number-formatter";

export default function DetailTransaction(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; sale_id: number}) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{sale: table.saleType, product: table.productType, saleDetail: table.saleDetailType}[]>([]);

    const getSaleDetail = useCallback(async (sale_id: number) => {
        return await axios.get(`${process.env.API_URL}/transaction/detail?sale_id=${sale_id}`).then((response) => {
            if(response.status === 200){
                const data: {sale: table.saleType, product: table.productType, saleDetail: table.saleDetailType}[] = response.data.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            if(props.errorSnackBarMessage) props.errorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const loadData = useCallback(async () => {
        setIsLoading(true);

        await getSaleDetail(props.sale_id);
    }, [getSaleDetail, props.sale_id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[40rem] max-h-[80%] p-4 bg-white rounded-md relative">
            {isLoading ? <div className="flex justify-center items-center"><LoadingSpin className="h-6 w-6 border-[3px]"/></div> : <>
                <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                    <X/>
                </div>
                <div className="mb-4">
                    <h1 className="text-xl font-semibold">Detail Transaksi</h1>
                    <span className="text-gray-400 text-sm">ID Transaksi: {data[0]?.sale.sale_id}</span>
                </div>
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Tanggal Transaksi</span>
                    <span>{data[0]?.sale.sale_date}</span>
                </div>
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Total Belanja</span>
                    <span>{formatCurrency(data[0]?.sale.total_price ?? 0)}</span>
                </div>
                <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Pajak</span>
                    <span>12%</span>
                </div>
                {data[0]?.sale.customer_id ? <div className="flex my-2 justify-between">
                    <span className="text-gray-400">Diskon Member</span>
                    <span>5%</span>
                </div> : null}
                <div className="mt-4 overflow-auto">
                    <table className="w-full border-separate border-spacing-1">
                        <thead>
                            <tr>
                                <th className="font-normal bg-gray-100 text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama Produk</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Harga</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Jumlah</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Total</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data: {sale: table.saleType, product: table.productType, saleDetail: table.saleDetailType}, index: number) => {
                                return <tr key={index} className="text-center even:bg-gray-100 even:bg-opacity-50 odd:bg-white">
                                    <td className="p-2">{data.product.product_name}</td>
                                    <td className="p-2">{formatCurrency(data.product.price!)}</td>
                                    <td className="p-2">{data.saleDetail.quantity}</td>
                                    <td className="p-2">{formatCurrency(data.saleDetail.subtotal ?? 0)}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </>}
        </div>
    </div>
}