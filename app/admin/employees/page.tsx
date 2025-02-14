'use client'
import Employee from "@/src/templates/employee";
import Sidebar from "@/src/components/sidebar";
import SidebarMenuItem from "@/src/components/sidebar-menu-item";
import TopBar from "@/src/components/top-bar";
import { Package, User, Users } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function Page(){
    const router = useRouter();

    return <>
        <TopBar/>
        <Sidebar>
            <SidebarMenuItem icon={<User/>} title="Pegawai" onClick={() => router.push("/admin/employees")} active/>
            <SidebarMenuItem icon={<Package/>} title="Barang" onClick={() => router.push("/admin/products")}/>
            <SidebarMenuItem icon={<Users/>} title="Pelanggan" onClick={() => router.push("/admin/customers")}/>
        </Sidebar>
        <Employee />
    </>
}