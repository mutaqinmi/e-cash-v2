'use client'
import Body from "@/src/components/body";
import { CaretUpDown, Key, PencilSimple, TrashSimple, UserPlus } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { create } from "zustand";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import * as table from '@/src/db/schema';
import Loading from "../components/loading";

interface ComponentState {
    errorSnackBarMessage: string | null;
    setErrorSnackBarMessage: (message: string | null) => void;
    successSnackBarMessage: string | null;
    setSuccessSnackBarMessage: (message: string | null) => void;
    showAddEmployeeDialog: boolean | null;
    setShowAddEmployeeDialog: (show: boolean | null) => void;
    showEditEmployeeDialog: boolean | null;
    setShowEditEmployeeDialog: (show: boolean | null) => void;
    showEditEmployeePasswordDialog: boolean | null;
    setShowEditEmployeePasswordDialog: (show: boolean | null) => void;
    editedEmployeeData: table.employeeType | null;
    setEditedEmployeeData: (data: table.employeeType | null) => void;
    showDeleteEmployeeDialog: boolean | null;
    setShowDeleteEmployeeDialog: (show: boolean | null) => void;
}

interface EmployeeData {
    data: table.employeeType[];
    setData: (data: table.employeeType[]) => void;
}

const useComponent = create<ComponentState>((set) => ({
    errorSnackBarMessage: null,
    setErrorSnackBarMessage: (message: string | null) => set(() => ({errorSnackBarMessage: message})),
    successSnackBarMessage: null,
    setSuccessSnackBarMessage: (message: string | null) => set(() => ({successSnackBarMessage: message})),
    showAddEmployeeDialog: false,
    setShowAddEmployeeDialog: (show: boolean | null) => set(() => ({showAddEmployeeDialog: show})),
    showEditEmployeeDialog: false,
    setShowEditEmployeeDialog: (show: boolean | null) => set(() => ({showEditEmployeeDialog: show})),
    showEditEmployeePasswordDialog: false,
    setShowEditEmployeePasswordDialog: (show: boolean | null) => set(() => ({showEditEmployeePasswordDialog: show})),
    editedEmployeeData: null,
    setEditedEmployeeData: (data: table.employeeType | null) => set(() => ({editedEmployeeData: data})),
    showDeleteEmployeeDialog: false,
    setShowDeleteEmployeeDialog: (show: boolean | null) => set(() => ({showDeleteEmployeeDialog: show})),
}));

const useEmployeeData = create<EmployeeData>((set) => ({
    data: [],
    setData: (data: table.employeeType[]) => set(() => ({data}))
}));

export default function Employee(){
    const {
        errorSnackBarMessage,
        setErrorSnackBarMessage,
        successSnackBarMessage,
        setSuccessSnackBarMessage,
        showAddEmployeeDialog,
        setShowAddEmployeeDialog,
        showEditEmployeeDialog,
        setShowEditEmployeeDialog,
        showEditEmployeePasswordDialog,
        setShowEditEmployeePasswordDialog,
        editedEmployeeData,
        setEditedEmployeeData,
        showDeleteEmployeeDialog,
        setShowDeleteEmployeeDialog,
    } = useComponent();
    const {data, setData} = useEmployeeData();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const getAllEmployees = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/employee`).then((response) => {
            if(response.status === 200){
                const data: table.employeeType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const searchEmployee = useCallback(async (searchQuery: string) => {
        return await axios.get(`${process.env.API_URL}/employee?search=${searchQuery}`).then((response) => {
            if(response.status === 200){
                const data: table.employeeType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        });
    }, []);

    const searchHandler = async (searchQuery: string) => {
        if(searchQuery === "") return await getAllEmployees();

        await searchEmployee(searchQuery);
    }

    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        await getAllEmployees();
    }, [getAllEmployees]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    return isLoading ? <Loading className="pt-20 pl-72 p-8"/> : <Body className="pt-20 pl-72 p-8" errorSnackBarMessage={errorSnackBarMessage} errorSnackBarController={setErrorSnackBarMessage} successSnackBarMessage={successSnackBarMessage} successSnackBarController={setSuccessSnackBarMessage} showAddEmployeeDialog={showAddEmployeeDialog} setShowAddEmployeeDialog={setShowAddEmployeeDialog} onDataChanged={loadData} showEditEmployeeDialog={showEditEmployeeDialog} setShowEditEmployeeDialog={setShowEditEmployeeDialog} showEditEmployeePasswordDialog={showEditEmployeePasswordDialog} setShowEditEmployeePasswordDialog={setShowEditEmployeePasswordDialog} editedEmployeeData={editedEmployeeData} showDeleteEmployeeDialog={showDeleteEmployeeDialog} setShowDeleteEmployeeDialog={setShowDeleteEmployeeDialog}>
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-lg">
                <div className="flex gap-4 items-center">
                    <SearchField placeholder="Cari pegawai" onChange={searchHandler}/>
                    <IconButton icon={<UserPlus size={20}/>} label="Tambah Pegawai" onClick={() => setShowAddEmployeeDialog(true)} className="py-2 px-3"/>
                </div>
                {data.length ? <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.full_name!.localeCompare(b.full_name!)))}>
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama</span>
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
                                <th className="font-normal text-gray-400 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((employee: table.employeeType, index: number) => {
                                return <tr key={index} className="text-center">
                                    <td className="p-2">{employee.full_name}</td>
                                    <td className="p-2">{employee.user_name}</td>
                                    <td className="p-2">{employee.role}</td>
                                    <td className="p-2 flex gap-2 justify-center items-center">
                                        <IconButton icon={<PencilSimple size={16}/>} onClick={() => {
                                            setEditedEmployeeData(employee);
                                            setShowEditEmployeeDialog(true);
                                        }} className="aspect-square p-1"/>
                                        <IconButton icon={<Key size={16}/>} onClick={() => {
                                            setEditedEmployeeData(employee);
                                            setShowEditEmployeePasswordDialog(true);
                                        }} className="aspect-square p-1"/>
                                        <IconButton icon={<TrashSimple size={16}/>} onClick={() => {
                                            setEditedEmployeeData(employee);
                                            setShowDeleteEmployeeDialog(true);
                                        }} className="bg-red-500 hover:bg-red-700 aspect-square p-1"/>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div> : <div className="mt-6 text-center text-gray-500">Data pegawai belum ada.</div>}
            </div>
        </div>
    </Body>
}