'use client'
import Body from "@/src/components/body";
import { CaretUpDown, PencilSimple, TrashSimple, UserPlus } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { formatPhoneNumber } from "../lib/number-formatter";

export default function Employee(){
    return <Body className="pt-20 pl-72 p-8">
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-lg">
                <div className="flex gap-4 items-center">
                    <SearchField placeholder="Cari pegawai ..."/>
                    <IconButton icon={<UserPlus size={20}/>} label="Tambah Pegawai" onClick={() => {}} className="py-2 px-3"/>
                </div>
                <div className="mt-6">
                    <table className="w-full border-spacing-1 border-separate">
                        <thead>
                            <tr>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Alamat</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nomor Telepon</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Hak Akses</span>
                                        <CaretUpDown className="text-gray-500"/>
                                    </div>
                                </th>
                                <th className="font-normal bg-gray-100 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td className="p-2">Muhammad Ilham Mutaqin</td>
                                <td className="p-2">Mangkubumi, Tasikmalaya</td>
                                <td className="p-2">{formatPhoneNumber("085155114492")}</td>
                                <td className="p-2">Administrator</td>
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