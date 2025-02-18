'use client'
import Body from "@/src/components/body";
import { CaretUpDown, PencilSimple, TrashSimple, UserPlus } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { formatPhoneNumber } from "../lib/number-formatter";
import * as table from '@/src/db/schema';
import { create } from "zustand";
import { useCallback, useEffect, useState } from "react";
import Loading from "../components/loading";
import axios from "axios";

interface ComponentState {
    errorSnackBarMessage: string | null;
    setErrorSnackBarMessage: (message: string | null) => void;
    successSnackBarMessage: string | null;
    setSuccessSnackBarMessage: (message: string | null) => void;
    showAddCustomerDialog: boolean | null;
    setShowAddCustomerDialog: (show: boolean | null) => void;
    showEditCustomerDialog: boolean | null;
    setShowEditCustomerDialog: (show: boolean | null) => void;
    editedCustomerData: table.customerType | null;
    setEditedCustomerData: (data: table.customerType | null) => void;
    showDeleteCustomerDialog: boolean | null;
    setShowDeleteCustomerDialog: (show: boolean | null) => void;
}

interface CustomerData {
    data: table.customerType[];
    setData: (data: table.customerType[]) => void;
}

const useComponent = create<ComponentState>((set) => ({
    errorSnackBarMessage: null,
    setErrorSnackBarMessage: (message: string | null) => set(() => ({errorSnackBarMessage: message})),
    successSnackBarMessage: null,
    setSuccessSnackBarMessage: (message: string | null) => set(() => ({successSnackBarMessage: message})),
    showAddCustomerDialog: false,
    setShowAddCustomerDialog: (show: boolean | null) => set(() => ({showAddCustomerDialog: show})),
    showEditCustomerDialog: false,
    setShowEditCustomerDialog: (show: boolean | null) => set(() => ({showEditCustomerDialog: show})),
    editedCustomerData: null,
    setEditedCustomerData: (data: table.customerType | null) => set(() => ({editedCustomerData: data})),
    showDeleteCustomerDialog: false,
    setShowDeleteCustomerDialog: (show: boolean | null) => set(() => ({showDeleteCustomerDialog: show})),
}));

const useCustomerData = create<CustomerData>((set) => ({
    data: [],
    setData: (data: table.customerType[]) => set(() => ({data}))
}));

export default function Customer(){
    const {
        errorSnackBarMessage,
        setErrorSnackBarMessage,
        successSnackBarMessage,
        setSuccessSnackBarMessage,
        showAddCustomerDialog,
        setShowAddCustomerDialog,
        showEditCustomerDialog,
        setShowEditCustomerDialog,
        editedCustomerData,
        setEditedCustomerData,
        showDeleteCustomerDialog,
        setShowDeleteCustomerDialog,
    } = useComponent();
    const {data, setData} = useCustomerData();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAllCustomers = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/customer`).then((response) => {
            if(response.status === 200){
                const data: table.customerType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const searchCustomer = useCallback(async (searchQuery: string) => {
        return await axios.get(`${process.env.API_URL}/customer?search=${searchQuery}`).then((response) => {
            if(response.status === 200){
                const data: table.customerType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        });
    }, []);

    const searchHandler = async (searchQuery: string) => {
        if(searchQuery === "") return await getAllCustomers();

        await searchCustomer(searchQuery);
    }

    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        await getAllCustomers();
    }, [])

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? <Loading className="pt-20 pl-72 p-8"/> : <Body className="pt-20 pl-72 p-8" errorSnackBarMessage={errorSnackBarMessage} errorSnackBarController={setErrorSnackBarMessage} successSnackBarMessage={successSnackBarMessage} successSnackBarController={setSuccessSnackBarMessage} showAddCustomerDialog={showAddCustomerDialog} setShowAddCustomerDialog={setShowAddCustomerDialog} onDataChanged={loadData} showEditCustomerDialog={showEditCustomerDialog} setShowEditCustomerDialog={setShowEditCustomerDialog} editedCustomerData={editedCustomerData} showDeleteCustomerDialog={showDeleteCustomerDialog} setShowDeleteCustomerDialog={setShowDeleteCustomerDialog}>
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-lg">
                <div className="flex gap-4 items-center">
                    <SearchField placeholder="Cari pelanggan ..." onChange={searchHandler}/>
                    <IconButton icon={<UserPlus size={20}/>} label="Tambah Member" onClick={() => setShowAddCustomerDialog(true)} className="py-2 px-3"/>
                </div>
                {data.length ? <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.customer_name!.localeCompare(b.customer_name!)))}>
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama Pelanggan</span>
                                        <CaretUpDown className="text-gray-400"/>
                                    </div>
                                </th>
                                <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.customer_address!.localeCompare(b.customer_address!)))}>
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Alamat</span>
                                        <CaretUpDown className="text-gray-400"/>
                                    </div>
                                </th>
                                <th className="font-normal text-gray-400 py-2 cursor-pointer" onClick={() => setData(data.sort((a, b) => a.phone_number!.localeCompare(b.phone_number!)))}>
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nomor Telepon</span>
                                        <CaretUpDown className="text-gray-400"/>
                                    </div>
                                </th>
                                <th className="font-normal py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((customer: table.customerType, index: number) => {
                                return <tr key={index} className="text-center">
                                    <td className="p-2">{customer.customer_name}</td>
                                    <td className="p-2">{customer.customer_address}</td>
                                    <td className="p-2">{formatPhoneNumber(customer.phone_number?.toString()!)}</td>
                                    <td className="p-2 flex gap-2 justify-center items-center">
                                        <IconButton icon={<PencilSimple size={16}/>} onClick={() => {
                                            setEditedCustomerData(customer);
                                            setShowEditCustomerDialog(true);
                                        }} className="aspect-square p-1"/>
                                        <IconButton icon={<TrashSimple size={16}/>} onClick={() => {
                                            setEditedCustomerData(customer);
                                            setShowDeleteCustomerDialog(true);
                                        }} className="bg-red-500 hover:bg-red-700 aspect-square p-1"/>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div> : <div className="mt-6 text-center text-gray-500">Data pelanggan belum ada.</div>}
            </div>
        </div>
    </Body>
}