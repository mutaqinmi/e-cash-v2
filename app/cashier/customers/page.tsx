'use client'
import Sidebar from "@/src/components/sidebar";
import SidebarMenuItem from "@/src/components/sidebar-menu-item";
import TopBar from "@/src/components/top-bar";
import Customer from "@/src/templates/customer";
import { CashRegister, Package, Users } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function Page(){
    const router = useRouter();

    return <>
        <TopBar/>
        <Sidebar>
            <SidebarMenuItem icon={<CashRegister/>} title="Kasir" onClick={() => router.push("/cashier")}/>
            <SidebarMenuItem icon={<Package/>} title="Barang" onClick={() => router.push("/cashier/products")}/>
            <SidebarMenuItem icon={<Users/>} title="Pelanggan" onClick={() => router.push("/cashier/customers")} active/>
        </Sidebar>
        <Customer/>
    </>
}