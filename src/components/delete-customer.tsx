import Button from "./button";
import { useCallback } from "react";
import axios from "axios";
import * as table from '@/src/db/schema';
import OutlinedButton from "./outlined-button";

export default function DeleteCustomer(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void; data: table.customerType}){
    const deleteCustomer = useCallback(async (customer_id: number) => {
        return await axios.delete(`${process.env.API_URL}/customer?customer_id=${customer_id}`).then((response) => {
            if(response.status === 200){
                props.successSnackbarController!(response.data.message);
                if(props.onSuccess) props.onSuccess();
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            props.errorSnackBarMessage!(message);
        }).finally(() => props.popupController!(false));
    }, []);

    const deleteCustomerHandler = () => deleteCustomer(props.data.customer_id);
    
    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[25rem] p-4 bg-white rounded-md relative">
            <h1 className="text-xl font-semibold">Hapus {props.data.customer_name}?</h1>
            <span className="my-4 block">Apakah anda yakin untuk menghapus pelanggan ini? Aksi ini tidak dapat dibatalkan.</span>
            <div className="mt-4 flex justify-end items-center gap-2">
                <OutlinedButton className="py-2" label="Batal" onClick={() => props.popupController!(false)}></OutlinedButton>
                <Button className="py-2 bg-red-500 hover:bg-red-700" label="Hapus" onClick={() => deleteCustomerHandler()}></Button>
            </div>
        </div>
    </div>
}