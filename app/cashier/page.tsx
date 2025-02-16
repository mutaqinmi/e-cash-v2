'use client'
import Sidebar from "@/src/components/sidebar";
import SidebarMenuItem from "@/src/components/sidebar-menu-item";
import TopBar from "@/src/components/top-bar";
import Cashier from "@/src/templates/cashier";
import Customer from "@/src/templates/customer";
import Product from "@/src/templates/product";
import { CashRegister, Package, Users } from "@phosphor-icons/react";
import { useState } from "react";

export default function Page(){
    const [sidebarIndex, setSidebarIndex] = useState(1);
    const pages = () => {
        switch(sidebarIndex){
            case 1: return <Cashier/>
            case 2: return <Product/>
            case 3: return <Customer/>
        }
    }

    return <>
        <TopBar/>
        <Sidebar>
            <SidebarMenuItem icon={<CashRegister/>} title="Kasir" onClick={() => setSidebarIndex(1)} active={sidebarIndex === 1 ? true : false}/>
            <SidebarMenuItem icon={<Package/>} title="Barang" onClick={() => setSidebarIndex(2)} active={sidebarIndex === 2 ? true : false}/>
            <SidebarMenuItem icon={<Users/>} title="Pelanggan" onClick={() => setSidebarIndex(3)} active={sidebarIndex === 3 ? true : false}/>
        </Sidebar>
        {pages()}
    </>
}