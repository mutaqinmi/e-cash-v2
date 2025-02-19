import { BoxArrowUp, CaretUpDown, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import * as table from '@/src/db/schema';
import axios from "axios";
import IconButton from "./icon-button";
import LoadingSpin from "./loading-spin";

export default function InactiveEmployeeList(props: {popupController?: (show: boolean | null) => void; successSnackbarController?: (message: string | null) => void; errorSnackBarMessage?: (message: string | null) => void; onSuccess?: () => void;}) {
    const [data, setData] = useState<table.employeeType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getAllEmployees = useCallback(async () => {
        return axios.get(`${process.env.API_URL}/employee?status=false`).then((response) => {
            if(response.status === 200){
                const data: table.employeeType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            if(props.errorSnackBarMessage) return props.errorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const activateEmployee = useCallback(async (employee_id: number) => {
        return await axios.patch(`${process.env.API_URL}/employee?employee_id=${employee_id}&status=true`, {}).then((response) => {
            if(response.status === 200){
                props.successSnackbarController!(response.data.message);
                if(props.onSuccess) props.onSuccess();
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            props.errorSnackBarMessage!(message);
        }).finally(() => props.popupController!(false));
    }, []);

    const activateEmployeeHandler = (selectedEmployeeID: number) => activateEmployee(selectedEmployeeID);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        await getAllEmployees();
    }, [getAllEmployees]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
        <div className="w-[40rem] max-h-[80%] p-4 bg-white rounded-md relative">
            <div onClick={() => props.popupController!(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full">
                <X/>
            </div>
            <h1 className="text-xl font-semibold">Arsip Pegawai</h1>
            {isLoading ? <div className="py-4 flex justify-center items-center"><LoadingSpin className="h-6 w-6 border-[3px]"/></div>  : data.length ? <div className="mt-6">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.full_name!.localeCompare(b.full_name!)))}>
                                <div className="flex justify-center items-center gap-2">
                                    <span>Nama Pegawai</span>
                                    <CaretUpDown className="text-gray-400"/>
                                </div>
                            </th>
                            <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.user_name!.localeCompare(b.user_name!)))}>
                                <div className="flex justify-center items-center gap-2">
                                    <span>Username</span>
                                    <CaretUpDown className="text-gray-400"/>
                                </div>
                            </th>
                            <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.role!.localeCompare(b.role!)))}>
                                <div className="flex justify-center items-center gap-2">
                                    <span>Hak Akses</span>
                                    <CaretUpDown className="text-gray-400"/>
                                </div>
                            </th>
                            <th className="font-normal py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((employee: table.employeeType, index: number) => {
                            return <tr key={index} className="text-center">
                                <td className="p-2">{employee.full_name}</td>
                                <td className="p-2">{employee.user_name}</td>
                                <td className="p-2">{employee.role}</td>
                                <td className="p-2 flex gap-2 justify-center items-center">
                                    <IconButton icon={<BoxArrowUp size={16}/>} onClick={() => activateEmployeeHandler(employee.employee_id)} className="aspect-square p-1"/>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div> : <div className="mt-6 text-center text-gray-500">Data pegawai belum ada.</div>}
        </div>
    </div>
}