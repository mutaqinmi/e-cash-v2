import { X } from "@phosphor-icons/react";
import Form from "next/form";
import Button from "./button";
import { useCallback } from "react";
import axios from "axios";
import * as table from '@/src/db/schema';
import PasswordField from "./password-field";

export default function EditEmployeePassword(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void; data: table.employeeType}){
    const updateEmployee = useCallback(async (employee_id: number, formData: FormData) => {
        return await axios.patch(`${process.env.API_URL}/employee`, {
            employee_id,
            password: formData.get("password"),
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

    const updateEmployeeHandler = (formData: FormData) => updateEmployee(props.data.employee_id, formData);

    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <div>
                <h1 className="text-2xl font-semibold">Edit Kata Sandi Pegawai</h1>
                <span className="text-sm">Edit kata sandi akses pegawai.</span>
            </div>
            <div className="mt-8">
                <Form action={updateEmployeeHandler} formMethod="POST">
                    <PasswordField label="Password" />
                    <Button className="w-full mt-8" label="Edit Kata Sandi Pegawai" formButton></Button>
                </Form>
            </div>
        </div>
    </div>
}