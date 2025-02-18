'use client'
import Sidebar from "@/src/components/sidebar";
import SidebarMenuItem from "@/src/components/sidebar-menu-item";
import TopBar from "@/src/components/top-bar";
import Cashier from "@/src/templates/cashier";
import Customer from "@/src/templates/customer";
import Overview from "@/src/templates/overview";
import Product from "@/src/templates/product";
import { CashRegister, ChartPieSlice, Package, Users } from "@phosphor-icons/react";
import { create } from "zustand";

interface Sidebar {
    sidebar: string;
    setSidebar: (sidebar: string) => void;
}

const useSidebar = create<Sidebar>((set) => ({
    sidebar: "cashier",
    setSidebar: (sidebar) => set({sidebar}),
}));

export default function Page(){
    const {sidebar, setSidebar} = useSidebar();
    const pages = () => {
        switch(sidebar){
            case "cashier": return <Cashier/>
            case "overview": return <Overview setSidebar={setSidebar}/>
            case "product": return <Product/>
            case "customer": return <Customer/>
        }
    }

    return <>
        <TopBar/>
        <Sidebar>
            <SidebarMenuItem icon={<CashRegister/>} title="Kasir" onClick={() => setSidebar("cashier")} active={sidebar === "cashier" ? true : false}/>
            <SidebarMenuItem icon={<ChartPieSlice/>} title="Ringkasan" onClick={() => setSidebar("overview")} active={sidebar === "overview" ? true : false}/>
            <SidebarMenuItem icon={<Package/>} title="Barang" onClick={() => setSidebar("product")} active={sidebar === "product" ? true : false}/>
            <SidebarMenuItem icon={<Users/>} title="Pelanggan" onClick={() => setSidebar("customer")} active={sidebar === "customer" ? true : false}/>
        </Sidebar>
        {pages()}
    </>
}