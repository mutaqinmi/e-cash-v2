import { BoxArrowUp, CaretUpDown, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import * as table from '@/src/db/schema';
import axios from "axios";
import { formatCurrency } from "../lib/number-formatter";
import IconButton from "./icon-button";
import LoadingSpin from "./loading-spin";

export default function ArchiveProductList(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void;}) {
    const [data, setData] = useState<table.productType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getAllProducts = useCallback(async () => {
        return axios.get(`${process.env.API_URL}/product?status=false`).then((response) => {
            if(response.status === 200){
                const data: table.productType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            if(props.errorSnackBarMessage) return props.errorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const unarchiveProduct = useCallback(async (product_id: number) => {
        return await axios.patch(`${process.env.API_URL}/product?product_id=${product_id}&status=true`, {}).then((response) => {
            if(response.status === 200){
                props.successSnackbarController!(response.data.message);
                if(props.onSuccess) props.onSuccess();
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            props.errorSnackBarMessage!(message);
        }).finally(() => props.popupController!(false));
    }, []);

    const unarchiveProductHandler = (selectedProductID: number) => unarchiveProduct(selectedProductID);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        await getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[40rem] max-h-[80%] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <h1 className="text-xl font-semibold">Arsip Produk</h1>
            {isLoading ? <div className="py-4 flex justify-center items-center"><LoadingSpin className="h-6 w-6 border-[3px]"/></div>  : data.length ? <div className="mt-6">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.product_name!.localeCompare(b.product_name!)))}>
                                <div className="flex justify-center items-center gap-2">
                                    <span>Nama Barang</span>
                                    <CaretUpDown className="text-gray-400"/>
                                </div>
                            </th>
                            <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.price! - b.price!))}>
                                <div className="flex justify-center items-center gap-2">
                                    <span>Harga</span>
                                    <CaretUpDown className="text-gray-400"/>
                                </div>
                            </th>
                            <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.stock! - b.stock!))}>
                                <div className="flex justify-center items-center gap-2">
                                    <span>Stok</span>
                                    <CaretUpDown className="text-gray-400"/>
                                </div>
                            </th>
                            <th className="font-normal py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((product: table.productType, index: number) => {
                            return <tr key={index} className="text-center">
                                <td className="p-2">{product.product_name}</td>
                                <td className="p-2">{formatCurrency(product.price!)}</td>
                                <td className="p-2">{product.stock}</td>
                                <td className="p-2 flex gap-2 justify-center items-center">
                                    <IconButton icon={<BoxArrowUp size={16}/>} onClick={() => unarchiveProductHandler(product.product_id)} className="aspect-square p-1"/>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div> : <div className="mt-6 text-center text-gray-500">Data produk belum ada.</div>}
        </div>
    </div>
}