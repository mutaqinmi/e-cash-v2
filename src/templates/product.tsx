'use client'
import Body from "@/src/components/body";
import { CaretUpDown, PencilSimple, Plus, TrashSimple } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { formatCurrency } from "../lib/number-formatter";

export default function Product(){
    return <Body className="pt-20 pl-72 p-8">
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-lg">
                <div className="flex gap-4 items-center">
                    <SearchField placeholder="Cari barang ..."/>
                    <IconButton icon={<Plus size={20}/>} label="Tambah Barang" onClick={() => {}} className="py-2 px-3"/>
                </div>
                <div className="mt-6">
                    <table className="w-full border-spacing-1 border-separate">
                        <thead>
                            <tr>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>ID Produk</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama Produk</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Harga</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Stok</span>
                                        <CaretUpDown className="text-gray-500"/>
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
                                <td className="p-2">290 pcs</td>
                                <td className="p-2 flex gap-2 justify-center items-center">
                                    <IconButton icon={<PencilSimple size={16}/>} onClick={() => {}} className="aspect-square p-1"/>
                                    <IconButton icon={<TrashSimple size={16}/>} onClick={() => {}} className="bg-red-500 hover:bg-red-700 aspect-square p-1"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Body>
}