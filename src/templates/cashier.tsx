'use client'
import Body from "@/src/components/body";
import { Minus, Plus } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { formatCurrency, formatInputtedCurrency } from "../lib/number-formatter";
import Form from "next/form";
import Button from "../components/button";
import { create } from "zustand";

interface Product {
    product_id: string;
    product_name: string;
    price: number;
    stock: number;
}

interface Component {
    totalPayment: string;
    setTotalPayment: (value: string) => void;
}

const useComponent =  create<Component>((set) => ({
    totalPayment: "",
    setTotalPayment: (value: string) => set(() => ({totalPayment: value}))
}));

export default function Cashier(){
    const { totalPayment, setTotalPayment } = useComponent();

    return <Body className="pt-20 pl-72 p-8">
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 max-h-fit bg-white p-4 rounded-lg">
                <div className="flex flex-col gap-4">
                    <SearchField placeholder="Cari barang ..." autoFocus/>
                </div>
                <div className="mt-6">
                    <table className="w-full border-spacing-1 border-separate">
                        <thead>
                            <tr>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>ID Produk</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama Produk</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Harga</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Jumlah</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Total</span>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td className="p-2">P-101029</td>
                                <td className="p-2">Indomie Ayam Bawang</td>
                                <td className="p-2">{formatCurrency(3000)}</td>
                                <td className="p-2 flex gap-3 items-center justify-center">
                                    <IconButton icon={<Plus size={10} weight="bold"/>} onClick={() => {}} className="aspect-square px-1 py-1"/>
                                    <span>3</span>
                                    <IconButton icon={<Minus size={10} weight="bold"/>} onClick={() => {}} className="aspect-square px-1 py-1"/>
                                </td>
                                <td className="p-2">{formatCurrency(9000)}</td>
                                <td className="p-2 flex gap-2 justify-center items-center">
                                    <IconButton icon={<Minus size={12} weight="bold"/>} onClick={() => {}} className="aspect-square px-1 py-1 bg-red-500 hover:bg-red-700"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-span-1 max-h-fit flex flex-col gap-4">
                <div className="text-center bg-white p-4 rounded-lg">
                    <span>Total</span>
                    <h1 className="text-4xl font-semibold mt-2">{formatCurrency(253000)}</h1>
                </div>
                <div className="text-center bg-white p-4 rounded-lg">
                    <span>Bayar</span>
                    <Form action={""} formMethod="POST" className="mt-2">
                        <div className="flex gap-2 items-center justify-center">
                            <label htmlFor="payment" className="text-2xl font-semibold">Rp.</label>
                            <input required name="payment" type="text" className="w-full p-3 text-end text-2xl font-semibold outline-none" placeholder="0" value={totalPayment} onChange={(e) => setTotalPayment(formatInputtedCurrency(e.currentTarget.value))}/>
                        </div>
                        <Button className="mt-4 w-full" label="Bayar" formButton/>
                    </Form>
                </div>
            </div>
        </div>
    </Body>
}