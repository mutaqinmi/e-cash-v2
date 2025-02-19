import { X } from "@phosphor-icons/react";
import Form from "next/form";
import Button from "./button";
import { useCallback } from "react";
import axios from "axios";
import * as table from '@/src/db/schema';
import PriceField from "./price-field";
import NumberField from "./number-field";
import { formatInputtedCurrency } from "../lib/number-formatter";

export default function EditProduct(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void; data: table.productType}){
    const updateProduct = useCallback(async (product_id: number, formData: FormData) => {
        return await axios.patch(`${process.env.API_URL}/product`, {
            product_id,
            price: formData.get("harga barang"),
            stock: formData.get("stok barang")
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if(response.status === 200){
                props.successSnackbarController!(response.data.message);
                if(props.onSuccess) props.onSuccess();
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            props.errorSnackBarMessage!(message);
        }).finally(() => props.popupController!(false));
    }, []);

    const updateProductHandler = (formData: FormData) => updateProduct(props.data.product_id, formData);

    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <div>
                <h1 className="text-2xl font-semibold">Edit {props.data.product_name}</h1>
                <span className="text-sm">Edit data {props.data.product_name}.</span>
            </div>
            <div className="mt-8">
                <Form action={updateProductHandler} formMethod="POST">
                    <PriceField label="Harga Barang" defaultValue={formatInputtedCurrency(props.data.price?.toString()!)}/>
                    <NumberField label="Stok Barang" defaultValue={props.data.stock?.toString()}/>
                    <Button className="w-full mt-8" label="Edit Barang" formButton></Button>
                </Form>
            </div>
        </div>
    </div>
}