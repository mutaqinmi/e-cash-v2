import { X } from "@phosphor-icons/react";
import Form from "next/form";
import InputField from "./input-field";
import Button from "./button";
import { useCallback } from "react";
import axios from "axios";
import TextAreaField from "./text-area-field";
import PhoneField from "./phone-field";

export default function AddCustomer(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void}){
    const insertNewCustomer = useCallback(async (formData: FormData) => {
        return await axios.post(`${process.env.API_URL}/customer`, {
            customer_name: formData.get("nama pelanggan") as string,
            customer_address: formData.get("alamat") as string,
            phone_number: formData.get("nomor telepon") as string
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if(response.status === 201){
                props.successSnackbarController!(response.data.message);
                if(props.onSuccess) props.onSuccess();
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            props.errorSnackBarMessage!(message);
        }).finally(() => props.popupController!(false));
    }, []);

    const insertNewCustomerHandler = (formData: FormData) => insertNewCustomer(formData);
    
    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <div>
                <h1 className="text-2xl font-semibold">Tambah Pelanggan</h1>
                <span className="text-sm">Tambahkan pelanggan baru.</span>
            </div>
            <div className="mt-8">
                <Form action={insertNewCustomerHandler} formMethod="POST">
                    <InputField label="Nama Pelanggan"/>
                    <TextAreaField label="Alamat"/>
                    <PhoneField label="Nomor Telepon"/>
                    <Button className="w-full mt-8" label="Tambah Pelanggan" formButton></Button>
                </Form>
            </div>
        </div>
    </div>
}