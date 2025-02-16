import { X } from "@phosphor-icons/react";
import Form from "next/form";
import InputField from "./input-field";
import Button from "./button";
import { useCallback } from "react";
import axios from "axios";
import * as table from '@/src/db/schema';
import TextAreaField from "./text-area-field";
import PhoneField from "./phone-field";
import { formatPhoneNumber } from "../lib/number-formatter";

export default function EditCustomer(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void; data: table.customerType}){
    const updateCustomer = useCallback(async (customer_id: number, formData: FormData) => {
        return await axios.patch(`${process.env.API_URL}/customer`, {
            customer_id,
            customer_name: formData.get("nama pelanggan"),
            customer_address: formData.get("alamat"),
            phone_number: formData.get("nomor telepon")
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

    const updateCustomerHandler = (formData: FormData) => updateCustomer(props.data.customer_id, formData);

    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <div>
                <h1 className="text-2xl font-semibold">Edit Pelanggan</h1>
                <span className="text-sm">Edit data pelanggan.</span>
            </div>
            <div className="mt-8">
                <Form action={updateCustomerHandler} formMethod="POST">
                    <InputField label="Nama Pelanggan" defaultValue={props.data.customer_name}/>
                    <TextAreaField label="Alamat" defaultValue={props.data.customer_address}/>
                    <PhoneField label="Nomor Telepon" defaultValue={formatPhoneNumber(props.data.phone_number!)}/>
                    <Button className="w-full mt-8" label="Edit Pelanggan" formButton></Button>
                </Form>
            </div>
        </div>
    </div>
}