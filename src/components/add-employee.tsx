import { X } from "@phosphor-icons/react";
import Form from "next/form";
import InputField from "./input-field";
import PasswordField from "./password-field";
import Dropdown from "./dropdown";
import Button from "./button";
import { useCallback } from "react";
import axios from "axios";

export default function AddEmployee(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void}){
    const insertNewEmployee = useCallback(async (formData: FormData) => {
        return await axios.post(`${process.env.API_URL}/employee`, {
            full_name: formData.get("nama pegawai"),
            user_name: formData.get("username"),
            password: formData.get("password"),
            role: formData.get("hak akses")
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

    const insertNewEmployeeHandler = (formData: FormData) => {
        // check if role is empty
        if(formData.get("hak akses") === null){
            props.errorSnackBarMessage!("Pilih hak akses untuk pegawai.");
            return;
        }

        insertNewEmployee(formData);
    };
    
    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <div>
                <h1 className="text-2xl font-semibold">Tambah Pegawai</h1>
                <span className="text-sm">Tambahkan pegawai baru.</span>
            </div>
            <div className="mt-8">
                <Form action={insertNewEmployeeHandler} formMethod="POST">
                    <InputField label="Nama Pegawai"/>
                    <InputField label="Username"/>
                    <PasswordField label="Password"/>
                    <Dropdown label="Hak Akses">
                        <option value="Administrator">Administrator</option>
                        <option value="Kasir">Kasir</option>
                    </Dropdown>
                    <Button className="w-full mt-8" label="Tambah Pegawai" formButton></Button>
                </Form>
            </div>
        </div>
    </div>
}