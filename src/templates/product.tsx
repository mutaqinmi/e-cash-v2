'use client'
import Body from "@/src/components/body";
import { CaretUpDown, PencilSimple, Plus, ArchiveBox, Archive } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { formatCurrency } from "../lib/number-formatter";
import { create } from "zustand";
import * as table from '@/src/db/schema';
import { useCallback, useEffect, useState } from "react";
import Loading from "../components/loading";
import axios from "axios";

interface ComponentState {
    errorSnackBarMessage: string | null;
    setErrorSnackBarMessage: (message: string | null) => void;
    successSnackBarMessage: string | null;
    setSuccessSnackBarMessage: (message: string | null) => void;
    showAddProductDialog: boolean | null;
    setShowAddProductDialog: (show: boolean | null) => void;
    showEditProductDialog: boolean | null;
    setShowEditProductDialog: (show: boolean | null) => void;
    editedProductData: table.productType | null;
    setEditedProductData: (data: table.productType | null) => void;
    showArchiveProductDialog: boolean | null;
    setShowArchiveProductDialog: (show: boolean | null) => void;
    showArchivedProductList: boolean | null;
    setShowArchivedProductList: (show: boolean | null) => void;
}

interface ProductData {
    data: table.productType[];
    setData: (data: table.productType[]) => void;
}

const useComponent = create<ComponentState>((set) => ({
    errorSnackBarMessage: null,
    setErrorSnackBarMessage: (message: string | null) => set(() => ({errorSnackBarMessage: message})),
    successSnackBarMessage: null,
    setSuccessSnackBarMessage: (message: string | null) => set(() => ({successSnackBarMessage: message})),
    showAddProductDialog: false,
    setShowAddProductDialog: (show: boolean | null) => set(() => ({showAddProductDialog: show})),
    showEditProductDialog: false,
    setShowEditProductDialog: (show: boolean | null) => set(() => ({showEditProductDialog: show})),
    editedProductData: null,
    setEditedProductData: (data: table.productType | null) => set(() => ({editedProductData: data})),
    showArchiveProductDialog: false,
    setShowArchiveProductDialog: (show: boolean | null) => set(() => ({showArchiveProductDialog: show})),
    showArchivedProductList: false,
    setShowArchivedProductList: (show: boolean | null) => set(() => ({showArchivedProductList: show})),
}));

const useProductData = create<ProductData>((set) => ({
    data: [],
    setData: (data: table.productType[]) => set(() => ({data}))
}));

export default function Product(){
    const {
        errorSnackBarMessage,
        setErrorSnackBarMessage,
        successSnackBarMessage,
        setSuccessSnackBarMessage,
        showAddProductDialog,
        setShowAddProductDialog,
        showEditProductDialog,
        setShowEditProductDialog,
        editedProductData,
        setEditedProductData,
        showArchiveProductDialog,
        setShowArchiveProductDialog,
        showArchivedProductList,
        setShowArchivedProductList
    } = useComponent();
    const {data, setData} = useProductData();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAllProducts = useCallback(async () => {
        return axios.get(`${process.env.API_URL}/product?status=true`).then((response) => {
            if(response.status === 200){
                const data: table.productType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const searchProduct = useCallback(async (searchQuery: string) => {
        return await axios.get(`${process.env.API_URL}/product?search=${searchQuery}`).then((response) => {
            if(response.status === 200){
                const data: table.productType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        });
    }, []);

    const searchHandler = async (searchQuery: string) => {
        if(searchQuery === "") return await getAllProducts();

        await searchProduct(searchQuery);
    }

    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        await getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? <Loading className="pt-20 pl-72 p-8"/> : <Body className="pt-20 pl-72 p-8" errorSnackBarMessage={errorSnackBarMessage} errorSnackBarController={setErrorSnackBarMessage} successSnackBarMessage={successSnackBarMessage} successSnackBarController={setSuccessSnackBarMessage} showAddProductDialog={showAddProductDialog} setShowAddProductDialog={setShowAddProductDialog} onDataChanged={loadData} showEditProductDialog={showEditProductDialog} setShowEditProductDialog={setShowEditProductDialog} editedProductData={editedProductData} showArchiveProductDialog={showArchiveProductDialog} setShowArchiveProductDialog={setShowArchiveProductDialog} showArchivedProductList={showArchivedProductList} setShowArchivedProductList={setShowArchivedProductList}>
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-lg">
                <div className="flex gap-4 items-center">
                    <SearchField placeholder="Cari barang" onChange={searchHandler}/>
                    <IconButton icon={<Plus size={20}/>} label="Tambah Barang" onClick={() => setShowAddProductDialog(true)} className="py-2 px-3"/>
                    <IconButton icon={<Archive size={24}/>} onClick={() => setShowArchivedProductList(true)} className="py-2 px-3"/>
                </div>
                {data.length ? <div className="mt-6">
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
                                        <IconButton icon={<PencilSimple size={16}/>} onClick={() => {
                                            setEditedProductData(product);
                                            setShowEditProductDialog(true);
                                        }} className="aspect-square p-1"/>
                                        <IconButton icon={<ArchiveBox size={16}/>} onClick={() => {
                                            setEditedProductData(product);
                                            setShowArchiveProductDialog(true);
                                        }} className="bg-orange-500 hover:bg-orange-700 aspect-square p-1"/>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div> : <div className="mt-6 text-center text-gray-500">Data produk belum ada.</div>}
            </div>
        </div>
    </Body>
}